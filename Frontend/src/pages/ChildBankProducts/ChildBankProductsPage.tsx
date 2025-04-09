import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import styles from './ChildBankProductsPage.module.css';
import JobCard from '@/components/jobs/JobCard';
import SearchBar from '@/components/jobs/SearchBar';
import FilterButtons from '@/components/jobs/FilterButtons';
import { apiCall } from '@/utils/api';

interface BankProduct {
  id: number;
  name: string;
  description: string;
  interestRate: number;
  period: number;
  type: 'deposit' | 'saving';
  monthlyPayment?: number;
  status: number;
  groupId: number;
  userId: number;
  productType: number;
  dueDate: number;
  payDate?: number;
  title: string;
}

const ChildBankProductsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [products, setProducts] = useState<BankProduct[]>([]);
  const navigate = useNavigate();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const groupId = useSelector((state: RootState) => state.auth.groupId);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching child products data...');
        const response = await apiCall<{ data: BankProduct[] }>(`finance/child/check/${groupId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        console.log('API Response:', response.data);
        const availableProducts = response.data.filter(product => product.status === 0);
        console.log('Available Products:', availableProducts);
        setProducts(availableProducts);
        console.log('Available products loaded successfully');
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [accessToken, groupId]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  const handleProductClick = (product: BankProduct) => {
    if (product.status === 1) {
      alert('계약된 상품은 상세 페이지에 접근할 수 없습니다.');
      return;
    }
    if (product.type === 'deposit') {
      navigate(`deposit/${product.id}`);
    } else {
      navigate(`saving/${product.id}`);
    }
  };

  const filteredProducts = products
    .filter(product => {
      // 검색어 필터링
      const matchesSearch = searchTerm ? 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) : 
        true;

      // 상품 유형 필터링
      const matchesFilter = 
        selectedFilter === 'all' || 
        (selectedFilter === 'deposit' && product.type === 'deposit') || 
        (selectedFilter === 'saving' && product.type === 'saving');

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => b.id - a.id);

  console.log('Filtered Products:', filteredProducts);

  return (
    <div className={styles.container}>
      <SearchBar 
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />
      
      <FilterButtons
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
        type="products"
      />

      <div className={styles.productList}>
        {filteredProducts.map(product => (
          <JobCard
            key={`${product.id}-${product.userId}`}
            status={product.productType === 0 ? '예금' : '적금'}
            title={product.title}
            onClick={() => handleProductClick(product)}
            onMoreClick={() => handleProductClick(product)}
          >
            <div className={styles.productInfo}>
              <div className={styles.infoRow}>
                <span className={styles.label}>이자율</span>
                <span className={styles.value}>{product.interestRate}%</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>기간</span>
                <span className={styles.value}>{product.dueDate}주</span>
              </div>
              {product.productType === 1 && (
                <div className={styles.infoRow}>
                  <span className={styles.label}>납입일</span>
                  <span className={styles.value}>매월 {product.payDate}일</span>
                </div>
              )}
             
            </div>
          </JobCard>
        ))}
      </div>
    </div>
  );
};

export default ChildBankProductsPage; 