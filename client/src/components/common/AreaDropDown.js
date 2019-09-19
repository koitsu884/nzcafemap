import React from 'react'

const areas = [
    ['北島', 'オークランド'],
    ['北島', 'ウェリントン'],
    ['北島', 'タウポ'],
    ['北島', 'タウランガ'],
    ['北島', 'ニュープリマス'],
    ['北島', 'ネイピア'],
    ['北島', 'パーマストンノース'],
    ['北島', 'ハミルトン'],
    ['北島', 'ファンガレイ'],
    ['北島', 'ロトルア'],
    ['北島', 'ワンガヌイ'],
    ['北島', 'その他'],
    ['南島', 'クライストチャーチ'],
    ['南島', 'クイーンズタウン'],
    ['南島', 'ダニーデン'],
    ['南島', 'テカポ'],
    ['南島', 'ネルソン'],
    ['南島', 'ワナカ'],
    ['南島', 'その他'],
]

const AreaDropDown = ({
    name,
    className,
    value,
    onChange,
    allowEmpty,
    additionalOption //{value, 'before' or 'after'}
}) => {
    return (
        <select className={className} name={name} onChange={onChange} value={value}>
            {
                allowEmpty ? <option key="empty" value=''></option> : null
            }
            {areas.map(area => {
                let areaStr = area.join(' - ');
                return (
                    <option key={areaStr} value={areaStr}>{areaStr}</option>
                )
            })}
        </select>
    )
}

export default AreaDropDown;
