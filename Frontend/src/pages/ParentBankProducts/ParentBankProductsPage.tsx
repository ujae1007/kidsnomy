import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { apiCall } from '@/utils/api';
import styles from './ParentBankProductsPage.module.css';
import JobCard from '@/components/jobs/JobCard';
import SearchBar from '@/components/jobs/SearchBar';
import FilterButtons from '@/components/jobs/FilterButtons';

interface BankProduct {
  id: number;
  groupId: number;
  userId: number;
  title: string;
  content: string;
  interestRate: number;
  dueDate: number;
  rateDate: number | null;
  payDate: number | null;
  productType: number; // 0: 예금, 1: 적금
}

interface ApiResponse {
  data: BankProduct[];
  status: string;
  message: string;
}

const ParentBankProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const selectedGroupId = useSelector((state: RootState) => state.group.selectedGroupId);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [products, setProducts] = useState<BankProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'deposit' | 'saving'>('all');

  const fetchProducts = async () => {
    if (!selectedGroupId) {
      console.log('No group ID selected');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching products for group:', selectedGroupId);
      const response = await apiCall<ApiResponse>(`finance/parent/check/${selectedGroupId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      console.log('API Response:', response);
      
      if (response?.data) {
        const validProducts = response.data.filter(product => 
          product && 
          typeof product.title === 'string' && 
          typeof product.productType === 'number'
        );
        console.log('Valid products:', validProducts);
        setProducts(validProducts);
      } else {
        setError('No data received from server');
      }
    } catch (err: any) {
      console.error('Error fetching products:', err);
      if (err.response?.status === 403) {
        setError('접근 권한이 없습니다.');
      } else if (err.response?.status === 500) {
        setError('서버 오류가 발생했습니다.');
      } else {
        setError('상품 목록을 불러오는데 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useEffect triggered with selectedGroupId:', selectedGroupId);
    if (selectedGroupId) {
      fetchProducts();
    }
  }, [selectedGroupId]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (filter: string) => {
    console.log('Filter changed to:', filter);
    setSelectedFilter(prevFilter => {
      console.log(`Setting filter from ${prevFilter} to ${filter}`);
      return filter as 'all' | 'deposit' | 'saving';
    });
  };

  useEffect(() => {
    console.log('Filter state changed:', selectedFilter);
  }, [selectedFilter]);

  const handleProductClick = (product: BankProduct) => {
    if (product.productType === 0) {
      navigate(`deposit/${product.id}`);
    } else {
      navigate(`saving/${product.id}`);
    }
  };

  const handleCreateClick = () => {
    navigate('create');
  };

  const filteredProducts = React.useMemo(() => {
    console.log('Recalculating filtered products with filter:', selectedFilter);
    return products
      .filter(product => {
        const matchesSearch = searchTerm ? 
          product.title?.toLowerCase().includes(searchTerm.toLowerCase()) : 
          true;
        
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
        
        if (matchesFilter) {
          console.log(`Matched - Product: ${product.title}, productType: ${product.productType}, filter: '${selectedFilter}'`);
        }
        
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => b.id - a.id);
  }, [products, searchTerm, selectedFilter]);

  console.log('Filtered Products:', filteredProducts);
  console.log('Selected Filter:', selectedFilter);

  if (loading) {
    return <div className={styles.container}>Loading...</div>;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          {error}
          <button onClick={fetchProducts}>다시 시도</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <SearchBar 
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />

      <button 
        className={styles.createButton}
        onClick={handleCreateClick}
      >
        은행 상품 만들기
      </button>
      
      <FilterButtons
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
        type="products"
      />
      
      <div className={styles.productList}>
        {filteredProducts.map(product => (
          <JobCard
            key={product.id}
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
              <div className={styles.infoRow}>
                <span className={styles.label}>설명</span>
                <span className={styles.value}>{product.content}</span>
              </div>
            </div>
          </JobCard>
        ))}
      </div>
    </div>
  );
};

export default ParentBankProductsPage;

