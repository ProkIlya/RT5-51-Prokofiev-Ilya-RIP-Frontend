import type { FC } from 'react';
import cartIcon from "../assets/icon.png";
import defaultCartIcon from "../assets/icon.png";

interface CartIconProps {
  count: number;
}

export const CartIcon: FC<CartIconProps> = ({ count }) => {
  const isDisabled = count === 0;

  return (
    <div 
      className="cart-icon" 
      style={{ 
        cursor: isDisabled ? 'not-allowed' : 'pointer', 
        display: 'flex', 
        alignItems: 'center', 
        marginLeft: '20px', 
        position: 'relative',
        opacity: isDisabled ? 0.3 : 0.7
      }}
    >
      <span 
        className="cart-count" 
        style={{
          backgroundColor: '#3E6AE1',
          color: 'white',
          borderRadius: '50%',
          padding: '3px 7px',
          fontWeight: 'bold',
          fontSize: '12px',
          position: 'absolute',
          top: '-5px',
          right: '-5px'
        }}
      >
        {count}
      </span>
      <img 
        src={cartIcon} 
        alt="Корзина" 
        style={{ 
          width: '60px', 
          height: '60px',
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).src = defaultCartIcon;
        }}
      />
    </div>
  );
};