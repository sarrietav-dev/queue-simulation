type NumberInputProps = {
    value: string;
    onChange: (value: string) => void;
};

function NumberInput({ value, onChange }: NumberInputProps) {
    return (
        <input
            type="text"
            value={value}
            onChange={(e) => {
                const amount = e.target.value;

                if (!amount || amount.match(/^\d{1,}(\.\d{0,4})?$/)) {
                    onChange(amount);
                }
            }}
        />
    );
}

export default NumberInput;
