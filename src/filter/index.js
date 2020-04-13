
let filters = {}

filters.valToName = (val, arr=[]) =>{
    if(!val) return ''
    if(!arr.length) return val;

    let result = ''
    let item = arr.find(i=>val==i.value)
    item && ((result = item.label) || (result = item.name));
    return result
}

export default filters



