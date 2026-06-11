import { WatchModel, BoutiqueLocation } from '../types';

export const WATCHES_DATA: WatchModel[] = [
  {
    id: 'chronos',
    tag: 'Model 01',
    name: 'Velora Chronos',
    tagline: 'Classic Sophistication',
    description: 'Mẫu đồng hồ automatic cổ điển với mặt số đen sâu thẳm, kim cọc số mạ vàng chế tác tinh xảo, đi kèm dây da mềm mại. Một tuyệt phẩm hoàn hảo cho mọi buổi tiệc tối, cuộc họp kinh doanh hay sự kiện đẳng cấp thượng lưu.',
    price: 12900000,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1000&q=90',
    caseSize: '42mm',
    waterResist: '5ATM',
    reservePower: '42h',
    bracketMaterial: 'Italian Leather',
    movementType: 'Automatic Caliber V1',
    highlights: [
      'Kính Sapphire nguyên khối chống trầy xước tuyệt đối',
      'Vỏ thép không gỉ 316L đánh bóng satin thủ công',
      'Đáy lộ cơ khí kính cường lực khoáng siêu bền'
    ]
  },
  {
    id: 'moonphase',
    tag: 'Model 02',
    name: 'Velora Moonphase',
    tagline: 'Astronomic Harmony',
    description: 'Thiết kế chu kỳ mặt trăng Moonphase lãng mạn, kết hợp cùng mặt xanh navy chải tia hoàng hôn và dây kim loại đúc đặc. Một biểu tượng rực rỡ dành cho những ai mê đắm thiên văn học và phong cách lịch lãm, sang quý.',
    price: 18500000,
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=1000&q=90',
    caseSize: '40mm',
    waterResist: '5ATM',
    reservePower: '48h',
    bracketMaterial: 'Brushed Steel',
    movementType: 'Automatic Moon-Caliber V2',
    highlights: [
      'Đĩa Moonphase mạ vàng 24k hiển thị lịch âm chuẩn xác',
      'Mặt số màu xanh Navy Deep Blue chải tia Sunburst chuyển sắc',
      'Dây kim loại thép đúc nguyên miếng chắc chắn, ôm tay'
    ]
  },
  {
    id: 'skeleton',
    tag: 'Model 03',
    name: 'Velora Skeleton',
    tagline: 'Mechanical Symphony',
    description: 'Thiết kế khung xương Skeleton tinh xảo phô diễn toàn bộ nghệ thuật sắp đặt của hàng trăm bánh răng cơ khí đang hoạt động nhịp nhàng bên trong. Một kiệt tác đại diện cho sự mạnh mẽ, nam tính và phong cách đỉnh cao.',
    price: 25000000,
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=1000&q=90',
    caseSize: '43mm',
    waterResist: '5ATM',
    reservePower: '50h',
    bracketMaterial: 'Titanium Mesh',
    movementType: 'Skeleton Caliber V3 Master',
    highlights: [
      'Chạm khắc xương hở hai mặt hoàn mỹ bằng laser độ chính xác cao',
      'Trang bị chân kính hồng ngọc Ruby tăng tuổi thọ và độ trơn tru',
      'Vỏ máy phủ Carbon siêu nhẹ mạ mờ cực quý phái'
    ]
  },
  {
    id: 'sport',
    tag: 'Model 04',
    name: 'Velora Sport',
    tagline: 'Unyielding Power',
    description: 'Phiên bản đồng hồ thể thao mạnh mẽ với khả năng chịu nước tăng cường lên tới 100m, mặt số siêu dạ quang cùng thang đo vận tốc Tachymeter chuyên dụng. Sự kết hợp hoàn mỹ giữa sức bền dẻo dai và nét uy nghiêm quý tộc.',
    price: 16900000,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=90',
    caseSize: '44mm',
    waterResist: '10ATM',
    reservePower: '45h',
    bracketMaterial: 'Oyster Stainless Steel',
    movementType: 'Precision Auto Sport V4',
    highlights: [
      'Núm vặn cổ chai Screw-down tăng cường độ kín nước tuyệt hảo',
      'Kim và cọc số sơn dạ quang Super-LumiNova thế hệ mới',
      'Vòng xoay Bezel gốm Ceramic chống xước cực tốt'
    ]
  }
];

export const BOUTIQUES_DATA: BoutiqueLocation[] = [
  {
    id: 'hn',
    city: 'Hà Nội',
    name: 'Velora Boutique Tràng Tiền',
    address: 'Số 24 Tràng Tiền, Quận Hoàn Kiếm, Hà Nội',
    phone: '024.3934.8888'
  },
  {
    id: 'sg',
    city: 'Hồ Chí Minh',
    name: 'Velora Boutique Đồng Khởi',
    address: 'Số 88 Đồng Khởi, Quận 1, TP. Hồ Chí Minh',
    phone: '028.3822.9999'
  },
  {
    id: 'dn',
    city: 'Đà Nẵng',
    name: 'Velora Boutique Bạch Đằng',
    address: 'Số 102 Bạch Đằng, Quận Hải Châu, Đà Nẵng',
    phone: '0236.388.7777'
  }
];
