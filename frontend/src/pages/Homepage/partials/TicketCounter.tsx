import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TicketCounter({ max, value, setValue }: Props) {
	return (
		<div className='flex flex-col gap-2'>
			<Label>Số vé</Label>
			<Input
				type="number"
				value={value}
				max={max}
				onChange={(e) => setValue(e.target.value)}
				className="w-[240px]"
			/>
		</div>
	)
}

type Props = {
	max: number;
	value: number;
	setValue: (value: string) => void;
}
