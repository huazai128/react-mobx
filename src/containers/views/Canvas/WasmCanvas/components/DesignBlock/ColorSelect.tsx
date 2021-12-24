import React, { useState, useRef } from "react";
import { Popover } from 'antd'
import { DownOutlined } from "@ant-design/icons";
import { SketchPicker } from "react-color";

interface ColorSelectProps {
    color: any;
    showHex?: boolean
    disableAlpha?: boolean
    pColors?: string[]
    onChange: (c: any) => void;
}

const ColorSelect: React.FC<ColorSelectProps> = (props) => {
    const { color, onChange, showHex, disableAlpha, pColors } = props;
    const [selectedColor, setSelectedColor] = useState(color);
    const [isTransparent, setIsTransparent] = useState(false)
    const changeHandle = (color: any) => {
        const { a } = color.rgb;
        if (!a) setIsTransparent(true);
        else setIsTransparent(false);
        setSelectedColor(color.rgb)
    }

    const presetColors = disableAlpha ?
        ['#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321',
            '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986',
            '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF',] :
        ['#D0021B', '#F5A623', '#F8E71C', '#8B572A',
            '#7ED321', '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986',
            '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF', 'transparent']
    return (
        <div className="color-picker">
            <Popover
                content={
                    <div className="swatch">
                        <div className={`color ${color === 'transparent' || isTransparent ? 'no-color' : ''}`} style={{ backgroundColor: color }} />
                        {showHex ? <span>{color.toLowerCase()}</span> : null}
                        {/* <DownOutlined /> */}
                    </div>
                }
            >
                <SketchPicker
                    disableAlpha={disableAlpha}
                    color={selectedColor}
                    onChange={changeHandle}
                    onChangeComplete={onChange}
                    presetColors={pColors || presetColors}
                />
            </Popover>
        </div>
    );
};
export default ColorSelect;
