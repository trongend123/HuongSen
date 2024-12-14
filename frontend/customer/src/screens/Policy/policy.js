import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './policy.css';
const Policy = () => {
  const navigate = useNavigate();

  const handleRefundClick = () => {
    navigate('/refund');
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center">Chính Sách Của Chúng Tôi</h1>

      <div>
        <h4>Chính Sách Đặt Phòng</h4>
        <h5>Đối với khách lẻ:</h5>
        <ul>
          <li> Khách hàng cần nhập đầy đủ và chính xác thông tin của mình.</li>
          <li> Khách hàng có thể kiểm tra thông tin đặt phòng của mình tại trang web của nhà khách thông qua trang "Tra cứu đơn" hoặc thông tin được gửi qua email khi đặt phòng</li>
          <li> Khách hàng cần thanh toán toàn bộ số tiền để có thể đặt phòng thành công với nhà khách.</li>
          <li> Khách hàng chỉ có thể đặt phòng tại một cơ sở trong một đơn đặt phòng. Nếu có nhu cầu đặt phòng nhiều cơ sở, khách hàng vui lòng tạo nhiều đơn đặt phòng hoặc liên hệ lễ tân để hỗ trợ đặt phòng hộ.</li>
          <li> Với trường hợp nhờ lễ tân đặt phòng hộ, thông tin đặt phòng của bạn sẽ không được gửi qua email. Thay vào đó, lễ tân sẽ trực tiếp gửi thông tin qua phương thức liên hệ cho khách hàng.</li>
        </ul>
        <h5>Đối với khách đoàn:</h5>
        <ul>
          <li> Khách đoàn cần nhập đầy đủ và chính xác thông tin của mình.</li>
          <li> Khách đoàn cần cọc 20% số tiền đặt phòng tại nhà khách để tiến hành làm hợp đồng.</li>
          <li> Hợp đồng sẽ được tạo dựa trên thông tin đặt phòng với khách hàng và gửi tới khách hàng để xác nhận chữ ký.</li>
          <li> Trong trường hợp muốn thay đổi các đơn đặt phòng, khách đoàn cần gửi thông tin chi tiết cho nhà khách tối thiểu 2 ngày trước khi check-in</li>
          <li> Nếu quá thời hạn chỉnh sửa, khách hàng chỉ có thể đặt thêm phòng theo nhu cầu của mình.</li>
        </ul>
      </div>

      <div>
        <h4>Chính Sách Hủy Phòng</h4>
        <h5>Đối với khách lẻ:</h5>
        <ul>
          <li> Khách hàng có thể hủy phòng của mình tối thiểu 2 ngày trước khi check-in</li>
          <li> Trong trường hợp đã quá hạn hủy phòng, khách hàng sẽ mất toàn bộ số tiền đặt phòng.</li>
          <li> Khách hàng cũng có thể hủy các đơn dịch vụ của mình tối thiểu 2 ngày trước khi check-in.</li>
          <li> Khi khách hàng hủy phòng, sẽ đồng thời hủy tất cả các đơn dịch vụ của mình.</li>
        </ul>
        <h5>Đối với khách đoàn:</h5>
        <ul>
          <li> Khách đoàn không thể hủy đơn sau khi đã cọc với nhà khách.</li>
          <li> Khách đoàn có thể hủy lẻ các phòng đặt của mình trong đơn hàng.</li>
        </ul>
      </div>
    </Container>
  );
};

export default Policy;
