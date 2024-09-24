import { useEffect, useRef, useState } from 'react';
import { Knihovna0Desktop } from './components/maps/knihovna_0/Knihovna0Desktop';
import { Knihovna0Mobile } from './components/maps/knihovna_0/Knihovna0Mobile';
import { Knihovna1Desktop } from './components/maps/knihovna_1/Knihovna1Desktop';
import { Knihovna1Mobile } from './components/maps/knihovna_1/Knihovna1Mobile';
import { KongresDesktop } from './components/maps/kongres/KongresDesktop';
import { KongresMobile } from './components/maps/kongres/KongresMobile';
import { MapWrapper } from './components/MapWrapper';
import { TabButton } from './components/TabButton';

import './App.css';

import closeBtnImg from './assets/closeBtnImg.svg';
import companies from './data/mapa_seats.json';
import { CompanyType } from './lib/appTypes';

function App() {
  const svgRef = useRef<SVGSVGElement>(null);

  const handleTableClick = (e: MouseEvent) => {
    const targetElement = e.target as HTMLElement;
    const parentElementId = targetElement.parentElement?.id;
  
    if (parentElementId) {
      const foundCompany = companies.find((company) => parentElementId === company.table);
      setSelectedCompany(foundCompany ?? null);
      return;
    }

    setSelectedCompany(null);
  };

  const mapOptions = [
    {
      id: 0,
      text: 'Kongresové centrum',
      mobileMap: <KongresMobile ref={svgRef} />,
      desktopMap: <KongresDesktop ref={svgRef} />,
    },
    {
      id: 1,
      text: 'U13/knihovna a rektorát - přízemí',
      mobileMap: <Knihovna0Mobile ref={svgRef} />,
      desktopMap: <Knihovna0Desktop ref={svgRef} />,
    },
    {
      id: 2,
      text: 'U13/knihovna a rektorát - 1. patro',
      mobileMap: <Knihovna1Mobile ref={svgRef} />,
      desktopMap: <Knihovna1Desktop ref={svgRef} />,
    },
  ];

  const [selectedCompany, setSelectedCompany] = useState<CompanyType | null>(null);
  const [selectedMapOption, setSelectedMapOption] = useState(mapOptions[0]);

  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsMobile(
      window.matchMedia('only screen and (max-width: 768px)').matches
    );
  }, [isMobile]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (svgRef?.current) {
        const svgElements = svgRef.current.querySelectorAll('g[id^="K"], g[id^="R"]');
        svgElements.forEach((element) => {
          const svgElement = element as SVGElement;
          const tableId = svgElement.getAttribute('id');
          console.log({ tableId });
          
          svgElement.addEventListener('click', handleTableClick);
        });
      }
    }, 100);
  
    return () => clearTimeout(timer);
  }, [selectedMapOption]);

  return (
    <div className="App relative">
      <header
        role="tablist"
        className="flex justify-center relative shadow-md md:overflow-hidden bg-bdOrange mb-4 md:mb-12 w-full"
        aria-label="tabs"
      >
        <div className="w-full lg:10/12 xl:w-3/4 grid justify-center md:grid-cols-3 items-center md:h-16">
          {mapOptions.map((option) => (
            <TabButton
              key={option.id}
              optionId={option.id}
              selectedOptionId={selectedMapOption.id}
              text={option.text}
              handleOnClick={() => setSelectedMapOption(option)}
            />
          ))}
        </div>
      </header>

      {selectedCompany && (
        <div className="company-detail fixed z-10 bg-bdOrange w-80 h-40 p-4 top-1/4 rounded-lg">
          <div className="flex justify-end mb-2">
            <button onClick={() => setSelectedCompany(null)}>
              <img src={closeBtnImg} alt="close" />
            </button>
          </div>
          <div className="company-detail-content flex flex-col text-lg items-center justify-center text-center text-white">
            {selectedCompany.link && selectedCompany.name && (
              <a
                className="company-link"
                target="_blank"
                href={selectedCompany.link}
              >
                <h2 className="company-name">{selectedCompany.name}</h2>
              </a>
            )}
            {!selectedCompany.link && selectedCompany.name && (
              <h2 className="company-name">{selectedCompany.name}</h2>
            )}
          </div>
        </div>
      )}

      <MapWrapper
        isMobile={isMobile}
        mobileMap={selectedMapOption.mobileMap}
        desktopMap={selectedMapOption.desktopMap}
      />

      <a
        href="https://businessday.utb.cz/"
        className="fixed bottom-10 bg-bdOrange text-white px-4 py-2 z-10"
      >
        Zpátky na Business day
      </a>
    </div>
  );
}

export default App;
