import cron from "node-cron";
import Task from "./models/taskModel";
import { executeTask } from "./controllers/taskControllers";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aarondev500@gmail.com",
    pass: "rpqu yylx mgnn ldoj",
  },
});

export const sendNotification = async (
  to: string,
  taskName: string,
  event?: object
): Promise<void> => {
  const mailOptions = {
    from: "aarondev500@gmail.com",
    to,
    subject: 'New Task Scheduled',
    text: `A new task "${taskName}" has been scheduled. Please see the attached invite.`,
    icalEvent: event
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Notification sent to:", to);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

const scheduleTaskExecution = async (): Promise<void> => {
  try {
    const now = new Date();
    const tasks = await Task.find({
      schedule: { $lte: new Date(now.getTime() - 10 * 1000) },
      status: "pending",
    }).exec();

    tasks.forEach(async (task) => {
      task.status = "queued";
      await task.save();
      console.log(`Task queued:: ${task.name}`);
    });
  } catch (error) {
    console.error("Error scheduling tasks:", error);
  }
};

const executeRecurringTasks = async (): Promise<void> => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tasks = await Task.find({
      type: "recurring",
      status: { $ne: "executed" },
    }).exec();

    tasks.forEach((task) => {
      cron.schedule("* * * * *", async () => {
        if (
          task.startDate &&
          task.endDate &&
          task.startDate <= now &&
          task.endDate >= now
        ) {
          // Check if the task has already executed today
          const lastExecutionDate = task.lastExecutionDate
            ? new Date(task.lastExecutionDate)
            : null;
          const lastExecutionDay = lastExecutionDate
            ? new Date(
                lastExecutionDate.getFullYear(),
                lastExecutionDate.getMonth(),
                lastExecutionDate.getDate()
              )
            : null;

          if (!lastExecutionDay || lastExecutionDay < today) {
            task.status = "queued";
            await task.save();
            console.log(`Recurring task queued: ${task.name}`);
            await executeTask(task._id.toString(), sendNotification);
          }
        } else if (task.endDate && task.endDate < now) {
          task.status = "executed";
          await task.save();
          console.log(`Recurring task executed: ${task.name}`);
        }
      });
    });
  } catch (error) {
    console.error("Error scheduling recurring tasks:", error);
  }
};

export { scheduleTaskExecution, executeRecurringTasks };
