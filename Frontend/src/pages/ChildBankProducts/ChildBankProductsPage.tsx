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
        
        // 각 상품의 필드 유효성 확인 및 로깅
        response.data.forEach(product => {
          console.log(`Product ID: ${product.id}, Title: ${product.title}, Type: ${product.productType}, Status: ${product.status}`);
        });
        
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
    console.log('Filter changed to:', filter);
    // 상태 업데이트 시 강제로 함수형 업데이트를 사용하여 최신 상태 보장
    setSelectedFilter(prevFilter => {
      console.log(`Setting filter from ${prevFilter} to ${filter}`);
      return filter;
    });
  };

  // useEffect를 추가하여 필터 변경 시 로그 출력 및 상태 확인
  useEffect(() => {
    console.log('Filter state changed:', selectedFilter);
    // 여기서는 상태 변경만 감지하고, 실제 필터링은 렌더링 시 수행
  }, [selectedFilter]);

  const handleProductClick = (product: BankProduct) => {
    if (product.status === 1) {
      alert('계약된 상품은 상세 페이지에 접근할 수 없습니다.');
      return;
    }
    
    let targetPath = '';
    
    if (product.productType === 0) {
      targetPath = `deposit/${product.id}`;
      console.log('Navigating to child deposit product detail:', targetPath);
    } else {
      targetPath = `saving/${product.id}`;
      console.log('Navigating to child saving product detail:', targetPath);
    }
    
    // 절대 경로로 지정하여 명확하게 라우팅
    navigate(targetPath);
  };

  // 필터링 로직 개선 - useMemo로 최적화하여 필요할 때만 재계산
  const filteredProducts = React.useMemo(() => {
    console.log('Recalculating filtered products with filter:', selectedFilter);
    return products
      .filter(product => {
        // 검색어 필터링
        const matchesSearch = searchTerm ? 
          (product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
          product.title?.toLowerCase().includes(searchTerm.toLowerCase())) : 
          true;

        // 상품 유형 필터링 - productType 기준으로 올바르게 필터링 (0: 예금, 1: 적금)
        let matchesFilter;
        if (selectedFilter === 'all') {
          matchesFilter = true;
        } else if (selectedFilter === 'deposit') {
          matchesFilter = product.productType === 0;
        } else if (selectedFilter === 'saving') {
          matchesFilter = product.productType === 1;
        } else {
          matchesFilter = false;
        }

        // 데이터 유효성 검증
        if (matchesFilter) {
          console.log(`Matched - Product: ${product.title || product.name}, productType: ${product.productType}, filter: '${selectedFilter}'`);
        }
        
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => b.id - a.id);
  }, [products, searchTerm, selectedFilter]); // 의존성 배열에 모든 관련 상태 포함

  console.log('Filtered Products:', filteredProducts);
  console.log('Selected Filter:', selectedFilter);

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