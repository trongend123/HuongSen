import React from 'react';
import './review.css';
import { RxAvatar } from "react-icons/rx";

const ReviewCard = ({ name, country, comment, rating }) => {
  return (
    <div className="review-card">
      
      <h4><RxAvatar /> {name} </h4>
      <p>{comment}</p>
      <div className="rating">Rating: {rating}/10</div>
    </div>
  );
};

const ServiceReviews = () => {
  const reviews = [
    { name: 'Minh', comment: 'Vị trí ngay gần trung tâm, gần ga tàu. Sân đỗ xe rộng rãi, sảnh tầng 1 rộng rãi thoáng mát, nhân viên cực kì thân thiện. Phòng có cửa sổ nhìn view toàn thành phố.', rating: 10 },
    { name: 'Phung', comment: 'Rộng thoáng mát, có chỗ để xe oto. Sạch sẽ, giá cả tốt. Gần trung tâm thành phố, đi lại dễ dàng thuận tiện. Nhân viên nhiệt tình, khách sạn lớn có 2 cầu thang máy', rating: 10 },
    { name: 'Anthony', comment: 'Location, close to the sea port (60k Grab ride away), not to far from the airport. Though it is dated, it is clean. The staff were very helpful and polite.', rating: 8.0 },
    { name: 'Yasuo', comment: '“部屋は広くバスタブ有りお湯もたっぷり、近くにGoogleマップに表示されて無いスーパーマーケット有り、とても満足、値段以上”', rating: 10 },
  ];

  return (
    <div className="service-reviews">
      <h4>Nhận xét từ khách hàng của nhà khách Hương Sen (Booking.com)</h4>
      <div className="reviews-list">
        {reviews.map((review, index) => (
          <ReviewCard
            key={index}
            name={review.name}
            comment={review.comment}
            rating={review.rating}
          />
        ))}
      </div>
    </div>
  );
};

export default ServiceReviews;
