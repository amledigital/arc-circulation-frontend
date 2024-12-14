export function RenderCheckbox({_id, toggleState, handleCheckAction}:{_id:string,toggleState:boolean,handleCheckAction:any}) {
    return (
    <input type="checkbox" data-id={_id} checked={toggleState} name={`ansId`} value={_id} onChange={handleCheckAction} />
    )
}

