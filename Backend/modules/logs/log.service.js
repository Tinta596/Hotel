import Log from "./logs.model.js";

export const createLog = async (data) => {
  const newLog = new Log(data);
  return await newLog.save();
};

export const getAllLogs = async (filters = {}, limit = 50, skip = 0) => {
  return await Log.find(filters)
    .populate('user', 'nombre email rol')
    .sort({ timestamp: -1 })
    .limit(limit)
    .skip(skip);
};

export const getLogById = async (id) => {
  return await Log.findById(id).populate('user', 'nombre email rol');
};

export const countLogs = async (filters = {}) => {
  return await Log.countDocuments(filters);
};