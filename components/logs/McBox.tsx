import NodeBox from './NodeBox'

export default function McBox(grid: {grid: Microgrid}) {
return (
    <>
        {grid.grid.nodes.map((node) => (
            <NodeBox key={node.id} node={node}/>
        ))}
    </>
)
}
