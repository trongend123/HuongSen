import OtherService from "../models/otherService.js";
// Create
const create = async ({
  name,
  price,
  description,
}) => {
  try {
    // Create new otherService
    const newOtherService = await OtherService.create({
      name,
      price,
      description,
    });
    // Return newOtherService object
    return newOtherService._doc;
  } catch (error) {
    throw new Error(error.toString());
  }
};
// Get all otherServices
const list = async () => {
  try {
    return await OtherService.find({}).exec();
  } catch (error) {
    throw new Error(error.toString());
  }
};

// const getById = async (id) => {
//   try {
//     return await OtherService.findOne({ _id: id }).exec();
//   } catch (error) {
//     throw new Error(error.toString());
//   }
// };
const getById = async (id) => {
  try {
    const service = await OtherService.findById(id);  // Assuming you're using Mongoose for MongoDB
    return service;
  } catch (error) {
    throw new Error('Error fetching service by ID');
  }
};

const edit = async (
  id,
  {
    name,
    price,
    description,
  }
) => {
  try {
    const updatedOtherService = await OtherService.findByIdAndUpdate(
      { _id: id },
      {
        name,
        price,
        description,
      },
      { new: true }
    );

    if (!updatedOtherService) {
      throw new Error("OtherService not found");
    }

    return updatedOtherService;
  } catch (error) {
    throw new Error(error.toString());
  }
};

const deleteOtherService = async (id) => {
  try {
    return await OtherService.findByIdAndDelete({ _id: id });
  } catch (error) {
    throw new Error(error.toString());
  }
};

// const softDelete = async (id) => {
//   try {
//     // Cập nhật trường isDeleted thành true thay vì xóa dịch vụ
//     const updatedService = await OtherService.findByIdAndUpdate(
//       id,
//       { isDeleted: true },  // Đánh dấu dịch vụ là đã xóa mềm
//       { new: true, runValidators: true }  // Trả về tài liệu đã cập nhật
//     );

//     // Kiểm tra xem dịch vụ có tồn tại không
//     if (!updatedService) {
//       throw new Error("Service not found");
//     }

//     return updatedService;
//   } catch (error) {
//     throw new Error(error.toString());
//   }
// };
const softDelete = async (id) => {
  try {
    // Tìm dịch vụ theo id
    const service = await OtherService.findById(id);

    // Kiểm tra xem dịch vụ có tồn tại không
    if (!service) {
      throw new Error("Service not found");
    }

    // Lật trạng thái isDeleted
    const updatedService = await OtherService.findByIdAndUpdate(
      id,
      { isDeleted: !service.isDeleted } // Trả về tài liệu đã cập nhật
    );

    return updatedService;
  } catch (error) {
    throw new Error(error.toString());
  }
};


// const OtherServiceRepo = {
//   // Thêm phương thức xóa mềm
//   softDelete: async (id) => {
//     return await OtherServices.findByIdAndUpdate(
//       id,
//       { isDeleted: true },  // Đánh dấu là đã xóa mềm
//       { new: true, runValidators: true }
//     );
//   },

// };

export default {
  create,
  list,
  getById,
  edit,
  deleteOtherService,
  softDelete
};
