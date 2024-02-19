import { TypoEpichat } from '../components/ui/ui/epichat-text';
import { LoginButton, GuestButton  } from '../components/ui/ui/login-button';

export default function Heroes() { 

  return (
    <div className="flex flex-col w-full h-full grid-cols-3 grid-rows-2">
      <div className="flex flex-row">
        <TypoEpichat />
      </div>
      
      <div className="flex flex-row">
        <LoginButton />
      </div>

      <div className="flex flex-row">
        <GuestButton />
      </div>
    </div>
  );
}
