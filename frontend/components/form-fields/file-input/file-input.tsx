import React, {FC} from 'react';
import Colors from "styles/colors";

/**
 * An input to upload a file
 */
export type FileInputProps = {
    label?: string,
    value?: File;
    onChange?: (newFile: File | null) => any,
    backgroundColor?: string,
    className?: string,
};

const defaultProps: FileInputProps = {
    onChange: () => {},
    backgroundColor: Colors.offWhite
};

export const FileInput: FC<FileInputProps> = (props) => {
    return (
        <label className={props.className}>
            {props.label}
            <input
                type={'file'}
                onChange={e => props.onChange?.(e.target.files?.item(0) ?? null)}
                style={{backgroundColor: props.backgroundColor}}
                multiple={false}
            />
        </label>
    );
};

FileInput.defaultProps = defaultProps;

