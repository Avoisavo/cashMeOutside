interface HeaderProps {
  userName?: string;
  profileImage?: string;
}

export default function Header({ 
  userName = "Tony", 
  profileImage = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" 
}: HeaderProps) {
  return (
    <div className="flex items-center justify-between p-5">
      <button className="w-10 h-10 bg-opacity-10 rounded-full flex items-center justify-center backdrop-blur-sm">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 20 20">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      <div className="flex items-center space-x-3">
        <span className="text-white font-bold text-l">{userName}</span>   
        <div className="w-12 h-12 bg-white rounded-full overflow-hidden">
          <img 
            src={profileImage} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
} 