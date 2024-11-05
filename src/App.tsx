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
import { CompanyType } from './lib/appTypes';
import { useFetchCompanies } from './lib/useFetchCompanies';

function App() {
  const svgRef = useRef<SVGSVGElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [selectedCompany, setSelectedCompany] = useState<CompanyType | null>(null);
  const { data: companies /*isLoading, err*/ } = useFetchCompanies();

  const handleTableClick = (e: MouseEvent) => {
    const targetElement = e.target as HTMLElement;
    const parentElementId = targetElement.parentElement?.id;

    if (parentElementId) {
      if (companies) {
        const foundCompany = companies.find((company) => parentElementId === company.fi_place);
        setSelectedCompany(foundCompany ?? null);
      }
      return;
    }

    setSelectedCompany(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setSelectedCompany(null);
      }
    };

    if (selectedCompany) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedCompany]);

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

  const [selectedMapOption, setSelectedMapOption] = useState(mapOptions[0]);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsMobile(window.matchMedia('only screen and (max-width: 768px)').matches);
  }, [isMobile]);

  useEffect(() => {
    if (!companies) return;

    const timer = setTimeout(() => {
      if (svgRef?.current) {
        const svgElements = svgRef.current.querySelectorAll('g[id^="K"], g[id^="R"]');
        svgElements.forEach((element) => {
          const svgElement = element as SVGElement;
          svgElement.addEventListener('click', handleTableClick);
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedMapOption, companies]);

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
        <div
          ref={modalRef} // Attach the ref to the modal
          className="company-detail fixed z-10 bg-white border-bdOrange border-solid border-4 shadow-xl w-full max-w-[calc(100%-32px)] md:max-w-[600px] max-h-[80vh] p-4 top-1/3 rounded-lg overflow-y-auto"
        >
          <div className="flex justify-between">
            <div className="p-2 rounded-lg bg-[#FBED62] text-black font-bold">{selectedCompany.fi_place}</div>
            <button onClick={() => setSelectedCompany(null)}>
              <img src={closeBtnImg} alt="close" />
            </button>
          </div>
          <div className="company-detail-content flex flex-col text-lg items-center justify-center text-center text-black">
            {selectedCompany ? (
              <div>
                {selectedCompany.fi_logo ? (
                  <div className="flex justify-center mb-4 w-full">
                    <img
                      src={`https://businessdays.utb.cz/wp-content/uploads/logo2022/${selectedCompany.fi_logo}`}
                      alt={`${selectedCompany.fi_nazev ?? 'Company'} logo`}
                      className="max-h-[65px] max-w-[100px] w-auto object-contain"
                      onError={(e) => {
                        /*e.currentTarget.src = 'fallback-image.png';*/ // Fallback image if the logo fails to load
                        e.currentTarget.alt = 'Logo nenačteno';
                      }}
                    />
                  </div>
                ) : (
                  <p className="error-text">Logo nenačteno</p>
                )}

                <h2 className="text-xl font-medium">{selectedCompany.fi_nazev ?? 'Název firmy nenačten'}</h2>
                <br />

                {selectedCompany.fi_id ? (
                  <a
                    className="company-link"
                    target="_blank"
                    href={`https://businessdays.utb.cz/firma-detail/?id=${selectedCompany.fi_id}`}
                  >
                    <p className="underline">Více informací</p>
                  </a>
                ) : (
                  <p className="error-text">Detail není dostupný</p>
                )}

                {selectedCompany.fi_web ? (
                  <a className="company-link" target="_blank" href={selectedCompany.fi_web}>
                    <p className="underline">Přejít na web firmy</p>
                  </a>
                ) : (
                  <p className="error-text">Web není dostupný</p>
                )}
              </div>
            ) : (
              <p>Chyba načítání. Zkuste to později.</p>
            )}
          </div>
        </div>
      )}

      <MapWrapper
        isMobile={isMobile}
        mobileMap={selectedMapOption.mobileMap}
        desktopMap={selectedMapOption.desktopMap}
      />

      <a href="https://businessday.utb.cz/" className="fixed bottom-10 bg-bdOrange text-white px-4 py-2 z-10">
        Zpátky na Business day
      </a>
    </div>
  );
}

export default App;
