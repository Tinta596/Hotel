import { log } from "console";
import logsModel from "./logs.model.js";

export const createLog = async (data) => {
    const log = new logsModel(data);
    return await log.save();
};

export const getAllLogs = async () => {
    return await log.find().populate('user', 'name email');
};

export const getLogById  = async (id) => {
    return await log.findById(id).populate('user', 'name email');
};