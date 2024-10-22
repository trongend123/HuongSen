import React from 'react';
import './review.css';

const ReviewCard = ({ name, country, comment, rating }) => {
  return (
    <div className="review-card">
      <h4>{name} <span>({country})</span></h4>
      <p>{comment}</p>
      <div className="rating">Rating: {rating}/10</div>
    </div>
  );
};

const ServiceReviews = () => {
  const reviews = [
    { name: 'Minh', country: 'Việt Nam', comment: 'Vị trí gần trung tâm, nhân viên thân thiện.', rating: 8.2 },
    { name: 'Khanh', country: 'Việt Nam', comment: 'Phòng rẻ, gần các quán ăn.', rating: 8.0 },
    { name: 'Antony', country: 'Vương Quốc Anh', comment: 'Rất gần cảng biển và sân bay, nhân viên nhiệt tình.', rating: 9.0 },
    { name: 'Yasuo', country: 'Nhật Bản', comment: 'Phòng rộng, đầy đủ tiện nghi.', rating: 8.5 },
  ];

  return (
    <div className="service-reviews">
      <h3>Đánh giá về dịch vụ</h3>
      <div className="reviews-list">
        {reviews.map((review, index) => (
          <ReviewCard
            key={index}
            name={review.name}
            country={review.country}
            comment={review.comment}
            rating={review.rating}
          />
        ))}
      </div>
    </div>
  );
};

export default ServiceReviews;
