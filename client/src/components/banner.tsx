interface rawStringType {
    key: string,
    str: string
}

export default function Banner() {
    return (
        <div className="[text-shadow:_0_1px_0_#ffffff] flex flex-col gap-0">
            {strs.map((data) => <pre key={data.key} className="text-slate-300">{data.str}</pre>)}
        </div>
    );
}

let str1 = String.raw` __ __ ____ ___ ___    __ __ __   ___ __________    `;
let str2 = String.raw`|  |  |    |   |   |  /  ]  |  | /  _] ___/ ___/    `;
let str3 = String.raw`|  |  ||  || _   _ | /  /|  |  |/  [(   \(   \_     `;
let str4 = String.raw`|  |  ||  ||  \_/  |/  / |  _  |    _]__  \__  |    `;
let str5 = String.raw`|  :  ||  ||   |   /   \_|  |  |   [_/  \ /  \ |    `;
let str6 = String.raw` \   / |  ||   |   \     |  |  |     \    \    |   `;
let str7 = String.raw`  \_/ |____|___|___|\____|__|__|_____|\___|\___|  `;
let strs: rawStringType[] = [
    {key : "str1", str: str1}, 
    {key : "str2", str: str2}, 
    {key : "str3", str: str3}, 
    {key : "str4", str: str4}, 
    {key : "str5", str: str5}, 
    {key : "str6", str: str6}, 
    {key : "str7", str: str7}, 
];
