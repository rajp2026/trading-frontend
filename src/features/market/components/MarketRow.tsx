import { useNavigate } from "react-router-dom";

interface Props {
  symbol: string;
  price: string;
  change?: number;
}

export default function MarketRow({ symbol, price, change }: Props) {
  const navigate = useNavigate();

  const changeColor = change && change > 0 ? "text-green-500" : "text-red-500";

  return (
    <div
      onClick={() => navigate(`/markets/${symbol}`)}
      className="grid grid-cols-3 px-3 py-2 text-sm hover:bg-white/5 cursor-pointer"
    >
      <div>{symbol}</div>

      <div>{price}</div>

      <div className={changeColor}>{change ? `${change}%` : "-"}</div>
    </div>
  );
}
