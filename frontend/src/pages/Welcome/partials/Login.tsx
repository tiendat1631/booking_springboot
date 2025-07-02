import { Button } from '@/components/ui/button';
import { CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';

type LoginProps = {
  switcher: () => void;
};

export default function Login({ switcher }: LoginProps) {
  const [isSubmitting, setSubmitting] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [isSubmit, setSubmit] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmit) return;

    setSubmit(true);
  };

  const handleSwitch = () => {
    if (isSubmit) return;
    switcher();
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Đăng nhập</CardTitle>
        <CardDescription>Nhận thêm nhiều ưu đãi khi đặt vé</CardDescription>
        <CardAction>
          <Button variant='link' className='px-2' onClick={handleSwitch}>Đăng ký</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="matbao@gmail.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Mật khẩu</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Quên mật khẩu?
                </a>
              </div>
              <Input id="password" type="password" required placeholder='●●●●●●●●' />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full">
          Đăng nhập
        </Button>
      </CardFooter>
    </>
  );
}
