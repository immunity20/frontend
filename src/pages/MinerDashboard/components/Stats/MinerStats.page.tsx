import React from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router';
import { Spacer } from 'src/components/layout/Spacer';
import { useActiveSearchParamWorker } from 'src/hooks/useActiveQueryWorker';
import StatsChart from './components/MinerStatsChart/MinerStats.chart';
import { MinerStats } from './components/StatsSection/Stats.section';
import { MinerWorkers } from './components/WorkersSection/Workers.section';
import { Button } from 'src/components/Button';
import qs from 'query-string';
import { AverageEffectivePeriods } from './minerStats.types';
import { useTranslation } from 'react-i18next';
import { WorkerTitle, Worker, WorkerCard } from './components';

export const MinerStatsPage = () => {
  const {
    params: { address, coin },
  } = useRouteMatch<{ address: string; coin: string }>();
  const [
    averageEffectivePeriods,
    setAverageEffectivePeriods,
  ] = React.useState<AverageEffectivePeriods>({ 6: 0, 12: 0 });

  const worker = useActiveSearchParamWorker();
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation('dashboard');

  React.useLayoutEffect(() => {
    if (worker) {
      setTimeout(() => {
        const scrollToEl = document.getElementById('workertabs');
        if (scrollToEl) {
          window.scrollTo({
            top: scrollToEl.getBoundingClientRect().top - 100 + window.scrollY,
            left: 0,
            behavior: 'smooth',
          });
        }
      }, 50);
    }
  }, [worker]);

  const handleResetActiveWorker = React.useCallback(() => {
    // just remove the worker
    const { worker, ...restQuery } = qs.parse(location.search);

    history.push({
      search: qs.stringify(restQuery),
    });
  }, [location.search, history]);

  return (
    <>
      {worker && (
        <>
          <WorkerCard padding>
            <div>
              <WorkerTitle>{t('stats.active_worker.title')}</WorkerTitle>
              <Worker>{worker}</Worker>
            </div>
            <div>
              <Button onClick={handleResetActiveWorker} size="sm">
                {t('stats.active_worker.reset')}
              </Button>
            </div>
          </WorkerCard>
          <Spacer />
        </>
      )}
      <MinerStats averageEffectivePeriods={averageEffectivePeriods} />
      <Spacer />
      <StatsChart
        setAverageEffectivePeriods={setAverageEffectivePeriods}
        address={address}
        coinTicker={coin}
      />
      <MinerWorkers address={address} />
    </>
  );
};