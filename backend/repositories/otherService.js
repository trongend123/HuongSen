import OtherService from "../models/otherService.js";

// Tạo mới OtherService
const create = async ({ name, price, description, serviceCate }) => {
  try {
    const newOtherService = await OtherService.create({
      name,
      price,
      description,
      serviceCate,
    });
    return newOtherService; // Trả về tài liệu mới tạo
  } catch (error) {
    throw new Error(`Error creating other service: ${error.message}`);
  }
};

// Lấy danh sách tất cả OtherServices
const list = async () => {
  try {
    return await OtherService.find({ isDeleted: false }).populate("serviceCate").exec(); // Chỉ lấy những dịch vụ chưa bị xóa
  } catch (error) {
    throw new Error(`Error fetching list of other services: ${error.message}`);
  }
};

// Lấy OtherService theo ID
const getById = async (id) => {
  try {
    const service = await OtherService.findById(id).populate("serviceCate").exec();
    if (!service || service.isDeleted) {
      throw new Error("Service not found or has been deleted");
    }
    return service;
  } catch (error) {
    throw new Error(`Error fetching service by ID: ${error.message}`);
  }
};

// Chỉnh sửa OtherService
const edit = async (id, { name, price, description, serviceCate }) => {
  try {
    const updatedOtherService = await OtherService.findByIdAndUpdate(
      id,
      { name, price, description, serviceCate },
      { new: true, runValidators: true }
    );

    if (!updatedOtherService || updatedOtherService.isDeleted) {
      throw new Error("Service not found or has been deleted");
    }

    return updatedOtherService;
  } catch (error) {
    throw new Error(`Error updating other service: ${error.message}`);
  }
};

// Xóa OtherService (hard delete)
const deleteOtherService = async (id) => {
  try {
    const deletedService = await OtherService.findByIdAndDelete(id);
    if (!deletedService) {
      throw new Error("Service not found");
    }
    return deletedService;
  } catch (error) {
    throw new Error(`Error deleting other service: ${error.message}`);
  }
};

// Xóa mềm OtherService
const softDelete = async (id) => {
  try {
    const service = await OtherService.findById(id);
    if (!service) {
      throw new Error("Service not found");
    }

    service.isDeleted = !service.isDeleted; // Lật trạng thái `isDeleted`
    await service.save();

    return service;
  } catch (error) {
    throw new Error(`Error soft deleting other service: ${error.message}`);
  }
};
const listByLocation = async (locationId) => {
  try {
    // Lọc OtherService dựa trên locationId
    const services = await OtherService.find({ isDeleted: false })
      .populate({
        path: "serviceCate",
        match: { locationId }, // Lọc theo locationId trong ServiceCate
        select: "locationId name", // Chọn các trường cần thiết từ ServiceCate
      })
      .exec();

    // Loại bỏ các dịch vụ không có serviceCate khớp với locationId
    return services.filter(service => service.serviceCate !== null);
  } catch (error) {
    throw new Error(`Error fetching services by location: ${error.message}`);
  }
};


export default {
  create,
  list,
  getById,
  edit,
  deleteOtherService,
  softDelete,
  listByLocation
};
