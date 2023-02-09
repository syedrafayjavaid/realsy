import {createUseStyles} from "react-jss";

export const tagsInputStyles = {
    tagsInput: {
        '& .react-tagsinput-remove': {
            color: '#eee',
            '&:hover': {
                color: '#fff',
            }
        }
    }
}

export const useTagsInputsStyles = createUseStyles(tagsInputStyles);
