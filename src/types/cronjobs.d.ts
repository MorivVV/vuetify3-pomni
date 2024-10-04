import { TaskJobSchedule } from "@/classes/cronjob/TaskJobSchedule";
import { IKnowledgebaseCronJobs } from "./database/schemas/knowledgebase";

interface CronJobTask extends IKnowledgebaseCronJobs {
  task: TaskJobSchedule;
  result?: string | null;
}
