import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const categories = [
    {
        categoryId: 1,
        name: "Smartphones"
    },
    {
        categoryId: 2,
        name: "Computers & Laptops"
    },
    {
        "categoryId": 3,
        "name": "Books"
    },
    {
        categoryId: 4,
        name: "CDs"
    },
    {
        categoryId: 5,
        name: "DVDs"
    },
    {
        categoryId: 6,
        name: "Motorbikes"
    },
    {
        categoryId: 7,
        name: "Bicycles"
    },
    {
        categoryId: 8,
        name: "Farm Equipment"
    },
    {
        categoryId: 9,
        name: "Jewellery"
    },
    {
        categoryId: 10,
        name: "Homeware"
    },
    {
        categoryId: 11,
        name: "Furniture"
    },
    {
        categoryId: 12,
        name: "Watches"
    },
    {
        categoryId: 13,
        name: "Instruments"
    },
    {
        categoryId: 14,
        name: "Electronics"
    },
    {
        categoryId: 15,
        name: "Office Equipment"
    },
    {
        categoryId: 16,
        name: "Tablets"
    },
    {
        categoryId: 17,
        name: "Paintings & Sculptures"
    },
    {
        categoryId: 18,
        name: "Bulk Items"
    },
    {
        categoryId: 19,
        name: "Gaming Consoles"
    },
    {
        categoryId: 20,
        name: "Hair Care"
    },
    {
        categoryId: 21,
        name: "Perfume"
    },
    {
        categoryId: 22,
        name: "Clothing"
    },
    {
        categoryId: 23,
        name: "Lego"
    },
    {
        categoryId: 24,
        name: "Figurines"
    },
    {
        categoryId: 25,
        name: "Cars"
    }
];

interface IMultiSelectProps {
    categoryIds: string[]
    updateMultiSelect: (arg:string[]) => void;
}

const MultipleSelectCheckmarks: React.FC<IMultiSelectProps> = ({categoryIds, updateMultiSelect}) => {
    const [categoryName, setCategoryName] = React.useState<string[]>([]);



    const returnFirst = (selected: string[]) => {
        let outputCategories: string[] = [];
        selected.forEach(function (item, index) {
            const first = categories.find((obj) => {
                return String(obj.categoryId) === item;
            })
            if (!first) {
                return "";
            }
            outputCategories.push(first.name)
        });

        return outputCategories.join(", ")


    }

    const handleChange = (event: SelectChangeEvent<typeof categoryName>) => {
        const {
            target: { value },
        } = event;
        setCategoryName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
        updateMultiSelect(typeof value === 'string' ? value.split(',') : value)

    };

    return (
        <div>
            <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-checkbox-label">Categories</InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={categoryName}
                    onChange={handleChange}
                    input={<OutlinedInput label="Categories" />}
                    renderValue={(selected) => returnFirst(selected)}
                        //selected.join(', ')}
                    MenuProps={MenuProps}
                >
                    {categories.map((category) => (
                        <MenuItem key={category.categoryId} value={String(category.categoryId)}>
                            <Checkbox checked={categoryName.indexOf(String(category.categoryId)) > -1} />
                            <ListItemText primary={category.name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

export default MultipleSelectCheckmarks;