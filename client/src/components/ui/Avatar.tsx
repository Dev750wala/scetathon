interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  src?: string;
}

const sizeClasses = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-12 w-12 text-base' };

export default function Avatar({ name, size = 'md', src }: AvatarProps) {
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  if (src) return <img src={src} alt={name} className={`${sizeClasses[size]} rounded-full object-cover`} />;
  return (
    <div className={`${sizeClasses[size]} rounded-full bg-green-600 text-white flex items-center justify-center font-semibold`}>
      {initials}
    </div>
  );
}
