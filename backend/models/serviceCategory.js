import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const serviceCategorySchema = new Schema(
  {
    locationId: {
      type: Schema.Types.ObjectId,
      ref: 'Locations', // Tham chiếu đến bảng Locations
      required: [true, "locationId là bắt buộc"],
    },
    name: {
      type: String,
      required: [true, "Tên của danh mục dịch vụ là bắt buộc"],
      trim: true,
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

const ServiceCategories = new mongoose.model('ServiceCategories', serviceCategorySchema);

export default ServiceCategories;
