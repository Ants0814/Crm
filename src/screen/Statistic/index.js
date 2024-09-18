import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// 애니메이션
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

// 컬러 팔레트 정의
const colors = {
  primary: '#3498db',
  secondary: '#2ecc71',
  tertiary: '#e74c3c',
  quaternary: '#f39c12',
  text: '#2c3e50',
};

// 스타일드 컴포넌트
const DashboardContainer = styled.div`
    width:100%;
  max-width: 1920px;
  margin: 0 auto;
  padding: 2rem;
  background-color: ${colors.background};
  color: ${colors.text};
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.5s ease-out;
`;

const DashboardHeader = styled.header`
  text-align: left;
  margin-bottom: 2rem;
  animation: ${slideUp} 0.5s ease-out;
`;

const DashboardTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${colors.primary};
  margin-bottom: 0.5rem;
`;

const DashboardSubtitle = styled.p`
  font-size: 1.25rem;
  color: ${colors.text};
  opacity: 0.8;
`;

const SectionContainer = styled.section`
  background-color: ${(props) => (props.importance === 'high' ? '#f0f9ff' : colors.cardBg)};
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid ${(props) => (props.importance === 'high' ? '#bae6fd' : '#e5e7eb')};
  animation: ${slideUp} 0.5s ease-out;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  color: ${colors.primary};
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e5e7eb;
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ChartCard = styled.div`
  background-color: ${colors.cardBg};
  border-radius: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 350px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ChartTitle = styled.h3`
  font-size: 1.25rem;
  color: ${colors.primary};
  margin-bottom: 1rem;
`;

const ChartWrapper = styled.div`
  flex-grow: 1;
`;

const MetricValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.secondary};
  margin-top: 1rem;
`;

const MetricGuide = styled.p`
  font-size: 0.875rem;
  color: ${colors.text};
  opacity: 0.7;
  margin-top: 0.5rem;
`;

// 차트 옵션 설정
const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { font: { size: 10, family: "'Noto Sans KR', sans-serif" } },
    },
    tooltip: {
      backgroundColor: 'rgba(0,0,0,0.8)',
      titleFont: { size: 12, family: "'Noto Sans KR', sans-serif" },
      bodyFont: { size: 10, family: "'Noto Sans KR', sans-serif" },
    },
  },
};

const lineBarOptions = {
  ...baseOptions,
  scales: {
    x: { grid: { display: false }, ticks: { font: { family: "'Noto Sans KR', sans-serif" } } },
    y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.1)' }, ticks: { font: { family: "'Noto Sans KR', sans-serif" } } },
  },
};

const doughnutPieOptions = {
  ...baseOptions,
  cutout: '70%',
  plugins: {
    ...baseOptions.plugins,
    tooltip: {
      ...baseOptions.plugins.tooltip,
      callbacks: {
        label: (context) => {
          const label = context.label || '';
          const value = context.parsed;
          const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${label}: ${percentage}%`;
        },
      },
    },
  },
};

// 차트 컴포넌트들
const MemoryUsageChart = ({ data }) => (
  <ChartCard>
    <ChartTitle>메모리 사용량</ChartTitle>
    <ChartWrapper>
      <Doughnut data={data} options={doughnutPieOptions} />
    </ChartWrapper>
    <MetricValue>{`${data.datasets[0].data[0]} GB / ${data.datasets[0].data.reduce((a, b) => a + b, 0)} GB`}</MetricValue>
    <MetricGuide>전체 메모리 중 사용 중인 메모리의 비율을 나타냅니다.</MetricGuide>
  </ChartCard>
);

const DiskUsageChart = ({ data }) => (
  <ChartCard>
    <ChartTitle>디스크 사용량</ChartTitle>
    <ChartWrapper>
      <Pie data={data} options={doughnutPieOptions} />
    </ChartWrapper>
    <MetricValue>{`${data.datasets[0].data[0]} GB / ${data.datasets[0].data.reduce((a, b) => a + b, 0)} GB`}</MetricValue>
    <MetricGuide>전체 디스크 공간 중 사용 중인 공간의 비율을 보여줍니다.</MetricGuide>
  </ChartCard>
);

const CpuUsageChart = ({ data }) => (
  <ChartCard>
    <ChartTitle>CPU 사용량</ChartTitle>
    <ChartWrapper>
      <Line data={data} options={lineBarOptions} />
    </ChartWrapper>
    <MetricValue>{`${data.datasets[0].data[data.datasets[0].data.length - 1]}%`}</MetricValue>
    <MetricGuide>시간에 따른 CPU 사용률의 변화를 나타냅니다.</MetricGuide>
  </ChartCard>
);

const NetworkTrafficChart = ({ data }) => (
  <ChartCard>
    <ChartTitle>네트워크 트래픽</ChartTitle>
    <ChartWrapper>
      <Bar data={data} options={lineBarOptions} />
    </ChartWrapper>
    <MetricValue>{`${data.datasets[0].data[data.datasets[0].data.length - 1]} Mbps`}</MetricValue>
    <MetricGuide>시간별 네트워크 트래픽 양을 보여줍니다.</MetricGuide>
  </ChartCard>
);

const DiskIOChart = ({ data }) => (
  <ChartCard>
    <ChartTitle>디스크 I/O</ChartTitle>
    <ChartWrapper>
      <Line data={data} options={lineBarOptions} />
    </ChartWrapper>
    <MetricValue>{`${data.datasets[0].data[data.datasets[0].data.length - 1]} IOPS`}</MetricValue>
    <MetricGuide>디스크 입출력 작업의 초당 수</MetricGuide>
  </ChartCard>
);

const ResponseTimeChart = ({ data }) => (
  <ChartCard>
    <ChartTitle>응답 시간</ChartTitle>
    <ChartWrapper>
      <Line data={data} options={lineBarOptions} />
    </ChartWrapper>
    <MetricValue>{`${data.datasets[0].data[data.datasets[0].data.length - 1]} ms`}</MetricValue>
    <MetricGuide>애플리케이션의 평균 응답 시간</MetricGuide>
  </ChartCard>
);

const ErrorRateChart = ({ data }) => (
  <ChartCard>
    <ChartTitle>오류율</ChartTitle>
    <ChartWrapper>
      <Line data={data} options={lineBarOptions} />
    </ChartWrapper>
    <MetricValue>{`${data.datasets[0].data[data.datasets[0].data.length - 1]}%`}</MetricValue>
    <MetricGuide>전체 요청 중 오류가 발생한 비율</MetricGuide>
  </ChartCard>
);

const ThroughputChart = ({ data }) => (
  <ChartCard>
    <ChartTitle>처리량</ChartTitle>
    <ChartWrapper>
      <Bar data={data} options={lineBarOptions} />
    </ChartWrapper>
    <MetricValue>{`${data.datasets[0].data[data.datasets[0].data.length - 1]} req/s`}</MetricValue>
    <MetricGuide>초당 처리되는 요청의 수</MetricGuide>
  </ChartCard>
);

const DatabaseTransactionsChart = ({ data }) => (
  <ChartCard>
    <ChartTitle>DB 트랜잭션</ChartTitle>
    <ChartWrapper>
      <Line data={data} options={lineBarOptions} />
    </ChartWrapper>
    <MetricValue>{`${data.datasets[0].data[data.datasets[0].data.length - 1]} TPS`}</MetricValue>
    <MetricGuide>초당 데이터베이스 트랜잭션 수</MetricGuide>
  </ChartCard>
);

const ActiveUsersChart = ({ data }) => (
  <ChartCard>
    <ChartTitle>활성 사용자 수</ChartTitle>
    <ChartWrapper>
      <Line data={data} options={lineBarOptions} />
    </ChartWrapper>
    <MetricValue>{data.datasets[0].data[data.datasets[0].data.length - 1]}</MetricValue>
    <MetricGuide>현재 시스템을 사용 중인 활성 사용자의 수</MetricGuide>
  </ChartCard>
);

const RevenueChart = ({ data }) => (
  <ChartCard>
    <ChartTitle>매출</ChartTitle>
    <ChartWrapper>
      <Bar data={data} options={lineBarOptions} />
    </ChartWrapper>
    <MetricValue>{`$${data.datasets[0].data[data.datasets[0].data.length - 1]}`}</MetricValue>
    <MetricGuide>시간에 따른 매출 추이</MetricGuide>
  </ChartCard>
);

export const Statistic = ({ systemMetrics }) => {
  // 실제 구현에서는 이 부분에 systemMetrics를 사용하여 각 차트의 데이터를 생성하는 로직이 들어갑니다.
  // 여기서는 예시 데이터를 사용합니다.

  const generateMockData = (label, count = 7) => ({
    labels: Array.from({ length: count }, (_, i) => `${i + 1}분 전`),
    datasets: [{
      label,
      data: Array.from({ length: count }, () => Math.floor(Math.random() * 100)),
      borderColor: colors.primary,
      backgroundColor: `${colors.primary}33`,
      fill: true,
    }],
  });

  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>시스템 성능 대시보드</DashboardTitle>
        <DashboardSubtitle>실시간 시스템 메트릭 모니터링</DashboardSubtitle>
      </DashboardHeader>
      
      <SectionContainer importance="high">
        <SectionTitle>핵심 시스템 성능</SectionTitle>
        <ChartGrid>
          <CpuUsageChart data={generateMockData('CPU 사용률')} />
          <MemoryUsageChart data={{
            labels: ['사용 중', '여유'],
            datasets: [{
              data: [8, 8],
              backgroundColor: [colors.primary, colors.background],
            }],
          }} />
          <DiskUsageChart data={{
            labels: ['사용됨', '여유'],
            datasets: [{
              data: [400, 600],
              backgroundColor: [colors.tertiary, colors.background],
            }],
          }} />
          <ResponseTimeChart data={generateMockData('응답 시간')} />
        </ChartGrid>
      </SectionContainer>

      <SectionContainer>
        <SectionTitle>애플리케이션 성능</SectionTitle>
        <ChartGrid>
          <ErrorRateChart data={generateMockData('오류율')} />
          <ThroughputChart data={generateMockData('처리량')} />
          <ActiveUsersChart data={generateMockData('활성 사용자')} />
        </ChartGrid>
      </SectionContainer>

      <SectionContainer>
        <SectionTitle>네트워크 및 스토리지</SectionTitle>
        <ChartGrid>
          <NetworkTrafficChart data={generateMockData('네트워크 트래픽')} />
          <DiskIOChart data={generateMockData('디스크 I/O')} />
        </ChartGrid>
      </SectionContainer>

      <SectionContainer>
        <SectionTitle>데이터베이스 성능</SectionTitle>
        <ChartGrid>
          <DatabaseTransactionsChart data={generateMockData('DB 트랜잭션')} />
        </ChartGrid>
      </SectionContainer>

      <SectionContainer importance="high">
        <SectionTitle>비즈니스 메트릭</SectionTitle>
        <ChartGrid>
          <RevenueChart data={generateMockData('매출')} />
        </ChartGrid>
      </SectionContainer>
    </DashboardContainer>
  );
};
