import closeBtnImg from '../assets/closeBtnImg.svg';
import { CompanyType } from '../lib/appTypes';

interface Props {
  selectedCompany: CompanyType;
  handleSelectCompany: () => void;
}

export const CompanyDetail = ({selectedCompany, handleSelectCompany}: Props) => {
  return (
    <div className="company-detail fixed z-10 bg-slate-200 w-80 h-40 p-4 top-1/4 rounded-lg">
      <div className="flex justify-end mb-2">
        <button onClick={handleSelectCompany}>
          <img src={closeBtnImg} alt="close" />
        </button>
      </div>
      <div className="company-detail-content flex flex-col items-center">
        <a className="company-link text-lg mb-4" href={selectedCompany.link}>
          <h2 className="company-name">{selectedCompany.name}</h2>
        </a>
        <p>{selectedCompany.description}</p>
      </div>
    </div>
  );
};

