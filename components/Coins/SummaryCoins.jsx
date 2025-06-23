/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, useCallback } from 'react';

import LineChart from '../UI/LineChart';

const SummaryCoins = ({ coinsData, changeSymbol }) => {
  const [coins, setCoins] = useState(coinsData);
  const [perPage, setPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const UPDATE_PER_SECONDES = 60000; // 60 seconds

  const addPerPage = () => {
    setIsLoading(true);
    setPerPage(perPage + 10);
    getCoins();
  };

  const setSymbol = (coin) => {
    changeSymbol(coin);
  };

  const numberSplitter = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getCoins = useCallback(async () => {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=false`
    );
    const data = await res.json();
    setCoins(data);
    setIsLoading(false);
  }, [perPage]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (document.visibilityState === 'visible') {
        await getCoins();
      }
    }, UPDATE_PER_SECONDES);
    return () => {
      clearInterval(interval);
    };
  }, [getCoins, perPage]);

  return (
    <div className='flex flex-col w-full h-full px-3 py-2 overflow-y-scroll gap-y-3 lg:gap-y-4 lg:p-8'>
      {coins.map((coin) => {
        return (
          <div
            className='flex items-center justify-between p-2 rounded-md cursor-pointer lg:grid lg:grid-cols-4 gap-x-3 hover:bg-gray-900'
            key={coin.id}
            onClick={setSymbol.bind(this, coin)}
          >
            <div className='flex items-center gap-x-3'>
              <div className='flex items-center justify-center rounded-full w-11 h-11'>
                <img src={coin.image} alt={coin.name} />
              </div>
              <div className='flex flex-col w-24 lg:w-auto'>
                <span className='text-sm font-medium text-white lg:text-lg'>{coin.name}</span>
                <span className='text-xs font-light text-gray-500'>{coin.symbol.toUpperCase()}</span>
              </div>
            </div>
            <div className='flex-col hidden sm:flex'>
              <span className='text-sm font-medium text-white lg:text-lg'>${numberSplitter(coin.market_cap)}</span>
              <span className='text-xs font-light text-gray-500'>
                {numberSplitter(coin.ath)} {coin.symbol.toUpperCase()}
              </span>
            </div>
            <div className='items-center justify-center hidden sm:flex'>
              <LineChart
                height={50}
                color={coin.price_change_percentage_24h > 0 ? '#22C55E' : '#EF4444'}
                coin={coin.id}
              />
            </div>
            <div className='flex flex-col items-end w-32 lg:w-auto'>
              <span className='text-xs text-gray-500 lg:text-sm'>
                <strong className='text-sm font-medium text-white lg:text-lg'>
                  {numberSplitter(coin.current_price.toFixed(2))}
                </strong>{' '}
                USD
              </span>
              <span className={`text-xs ${coin.price_change_percentage_24h < 0 ? 'text-red-500' : 'text-green-500'}`}>
                {coin.price_change_percentage_24h > 0 && '+'}
                {coin.price_change_percentage_24h.toFixed(2)}
              </span>
            </div>
          </div>
        );
      })}
      <div
        className='flex items-center justify-center w-full text-sm font-light text-gray-500 cursor-pointer'
        onClick={addPerPage}
      >
        {isLoading ? 'Loading...' : 'Load more...'}
      </div>
    </div>
  );
};

export default SummaryCoins;
