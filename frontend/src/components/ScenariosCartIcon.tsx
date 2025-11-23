import type { FC } from 'react';
import cartIcon from "../assets/icon.png";
import defaultCartIcon from "../assets/icon.png";

interface CartIconProps {
  count: number;
  onClick: () => void;
  disabled?: boolean;
}

export const CartIcon: FC<CartIconProps> = ({ count, onClick, disabled = false }) => {
  return (
    <div 
     // className="cart-icon" 
      style={{ 
        cursor: disabled ? 'not-allowed' : 'pointer', 
        display: 'flex', 
        alignItems: 'center', 
        marginRight: '20px',
        position: 'relative',
        gap: '8px',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        opacity: disabled ? 0.3 : 1
      }}
      onClick={disabled ? undefined : onClick}
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
          right: '-5px',
          zIndex: 1
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