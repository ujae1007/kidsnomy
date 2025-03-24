import React from 'react';

interface FinancialProduct {
  contract_id: number;
  product_type: number;
  title: string;
  content: string;
  interest_rate: number;
  due_date: number;
  start_day: string;
  end_day: string;
  account_id: string;
  balance: number;
  total_volume?: number;
  one_time_volume?: number;
  rate_volume?: number;
}

interface FinancialProductsProps {
  data: {
    user_id: number;
    contracts: FinancialProduct[];
  } | null;
}

const FinancialProducts: React.FC<FinancialProductsProps> = ({ data }) => {
  if (!data) {
    return <div>금융 상품 정보를 불러오는 중...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.contracts.map(product => (
        <div key={product.contract_id} className="product-card">
          <h3>{product.title}</h3>
          <p>{product.content}</p>
          <div>
            <p>계좌번호: {product.account_id}</p>
            <p>현재 잔액: {product.balance.toLocaleString()}원</p>
            <p>이자율: {product.interest_rate}%</p>
            <p>만기일: {new Date(product.end_day).toLocaleDateString()}</p>
            {product.total_volume && (
              <p>총 금액: {product.total_volume.toLocaleString()}원</p>
            )}
            {product.one_time_volume && (
              <p>일시 금액: {product.one_time_volume.toLocaleString()}원</p>
            )}
            {product.rate_volume && (
              <p>정기 금액: {product.rate_volume.toLocaleString()}원</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FinancialProducts; 