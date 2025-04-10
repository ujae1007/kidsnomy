import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { apiCall } from '@/utils/api';

const ProductDetailPage: React.FC<{ productId: number, productType: number }> = ({ productId, productType }) => {
  const [product, setProduct] = useState<any>(null);
  const isParent = useSelector((state: RootState) => state.auth.is_Parent === "1");
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    const fetchProduct = async () => {
      const path = productType === 0 ? `finance/deposit/${productId}` : `finance/savings/${productId}`;
      try {
        const response = await apiCall(path, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setProduct(response);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [productId, productType, accessToken]);

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.content}</p>
      <p>이자율: {product.interestRate}%</p>
      <p>기간: {product.dueDate}개월</p>
      {productType === 1 && <p>납입일: 매월 {product.payDate}일</p>}
      {!isParent && <button>수락</button>}
    </div>
  );
};

export default ProductDetailPage; 