interface InputBoxProps{
    label: string;
    placeholder: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputBox({label, placeholder, onChange}: InputBoxProps) {
    const inputType = label.toLowerCase() === 'password' ? 'password' : 'text';
    return <div>
      <div className="text-sm font-medium text-left py-2">
        {label}
      </div>
      <input type={inputType} onChange={onChange} placeholder={placeholder} className="w-full px-2 py-1 border rounded border-slate-200" />
    </div>
}