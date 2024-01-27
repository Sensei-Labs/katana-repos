/* eslint-disable @next/next/no-img-element */
import classNames from 'classnames';
import { WrapperStyle } from './style';

type ImageProps = BaseComponent & {
  src: string;
  alt?: string;
  width?: string | number;
  imageClass?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  height?: string | number;
  variant?: 'rounded' | 'shape' | 'default';
  imageStyle?: CSSProperties;
  loading?: 'lazy' | 'eager';
};

const variants = {
  rounded: ['rounded-[50%]'],
  shape: ['rounded-xl'],
  default: ['']
};

const objectFits = {
  cover: ['object-cover'],
  contain: ['object-contain'],
  fill: ['object-fill'],
  none: ['object-none'],
  'scale-down': ['object-scale-down']
};

const Image = ({
  src,
  alt,
  style,
  id,
  className,
  imageStyle,
  imageClass,
  height = 'initial',
  width = 'initial',
  objectFit = 'contain',
  variant = 'default',
  ...props
}: ImageProps) => {
  return (
    <WrapperStyle
      id={id}
      style={style}
      width={width}
      height={height}
      className={className}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={imageStyle}
        className={classNames(
          'rounded-[inherit]',
          variants[variant],
          objectFits[objectFit],
          imageClass
        )}
        {...props}
      />
    </WrapperStyle>
  );
};

export default Image;
