import type { ProcessStage } from '#/data/translations'

function Node({ x, y, width = 136, label, accent = false }: { x: number; y: number; width?: number; label: string; accent?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={width} height={60} rx={12} className={accent ? 'fill-surface-2 stroke-accent/70' : 'fill-surface stroke-border-strong'} />
      <circle cx={x + 18} cy={y + 30} r={3} className={accent ? 'fill-accent' : 'fill-muted'} />
      <text x={x + 32} y={y + 35} fontSize={14} className={accent ? 'fill-accent' : 'fill-foreground/80'}>{label}</text>
    </g>
  )
}

function Check({ x, y }: { x: number; y: number }) {
  return <path d={`M${x - 5} ${y}l4 4 8-9`} className="stroke-accent" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
}

/** Six diagrams share a frame and dimensions so stage changes never shift the layout. */
export function ProcessDiagram({ stage }: { stage: ProcessStage }) {
  const { id, nodes } = stage

  return (
    <svg viewBox="0 0 640 330" className="block w-full" role="img" aria-label={`${stage.title}: ${stage.deliverable}`} fontFamily="var(--font-sans)">
      {id === 'brief' && (
        <g>
          <g fill="none" className="stroke-border-strong" strokeWidth="1.5">
            <path d="M190 77H225Q245 77 245 107V165H255" />
            <path d="M190 253H225Q245 253 245 223V165" />
            <path d="M450 77H415Q395 77 395 107V165H385" />
            <path d="M450 253H415Q395 253 395 223V165" />
          </g>
          <circle cx="320" cy="165" r="76" className="fill-accent/5 stroke-accent/15" />
          <circle cx="320" cy="165" r="61" className="fill-surface-2 stroke-accent/60" />
          <path d="M308 139h19l9 9v38h-28zM327 139v10h9M316 160h12m-12 8h12m-12 8h8" className="stroke-accent" fill="none" strokeWidth="1.5" strokeLinejoin="round" />
          <text x="320" y="208" textAnchor="middle" fontSize="12" className="fill-muted">{nodes[4]}</text>
          <Node x={54} y={47} label={nodes[0]} />
          <Node x={54} y={223} label={nodes[1]} />
          <Node x={450} y={47} label={nodes[2]} />
          <Node x={450} y={223} label={nodes[3]} />
          <circle cx="245" cy="165" r="3" className="fill-accent" />
          <circle cx="395" cy="165" r="3" className="fill-accent" />
        </g>
      )}

      {id === 'scope' && (
        <g>
          <path d="M166 165h48m-7-5 7 5-7 5M426 165h48m-7-5 7 5-7 5" className="stroke-accent/60" strokeWidth="1.5" fill="none" />
          <Node x={30} y={135} label={nodes[0]} />
          <rect x="214" y="61" width="212" height="208" rx="16" className="fill-surface-2 stroke-accent/60" />
          <text x="239" y="94" fontSize="14" className="fill-accent">{nodes[1]}</text>
          {[130, 170, 210].map((y, index) => (
            <g key={y}>
              <rect x="239" y={y - 8} width="16" height="16" rx="4" className="fill-accent/10 stroke-accent/40" />
              <Check x={247} y={y} />
              <rect x="269" y={y - 4} width={index === 1 ? 93 : 113} height="7" rx="3.5" className="fill-foreground/20" />
            </g>
          ))}
          <Node x={474} y={135} label={nodes[2]} accent />
          <path d="M68 287h504" className="stroke-border-strong" fill="none" />
          {[98, 320, 542].map((x, index) => <g key={x}><circle cx={x} cy="287" r="5" className="fill-accent" /><text x={x} y="312" textAnchor="middle" fontSize="11" className="fill-muted">0{index + 1}</text></g>)}
        </g>
      )}

      {id === 'design' && (
        <g>
          <rect x="66" y="31" width="508" height="267" rx="14" className="fill-surface stroke-border-strong" />
          <path d="M66 69h508" className="stroke-border-strong" />
          <circle cx="87" cy="50" r="3" className="fill-accent" />
          <rect x="101" y="47" width="56" height="6" rx="3" className="fill-foreground/25" />
          {[413, 459, 505].map(x => <rect key={x} x={x} y="47" width="28" height="5" rx="2.5" className="fill-muted/30" />)}
          <rect x="94" y="101" width="93" height="5" rx="2.5" className="fill-accent/60" />
          <rect x="94" y="124" width="197" height="12" rx="4" className="fill-foreground/70" />
          <rect x="94" y="145" width="156" height="12" rx="4" className="fill-foreground/70" />
          <rect x="94" y="178" width="185" height="5" rx="2.5" className="fill-muted/30" />
          <rect x="94" y="190" width="154" height="5" rx="2.5" className="fill-muted/30" />
          <rect x="94" y="220" width="100" height="29" rx="14.5" className="fill-accent" />
          <text x="144" y="239" textAnchor="middle" fontSize="10" className="fill-accent-foreground">{nodes[0]}</text>
          <rect x="330" y="96" width="215" height="161" rx="10" className="fill-accent/5 stroke-accent/25" />
          <circle cx="437" cy="176" r="47" className="fill-accent/10 stroke-accent/60" />
          <path d="m437 137 34 20v39l-34 20-34-20v-39zm-34 20 34 20 34-20m-34 20v39m0-39v-40" className="stroke-accent/60" fill="none" />
          <path d="m473 228 4 30 8-10 12-2z" className="fill-foreground stroke-surface" strokeWidth="2" />
          <text x="320" y="282" textAnchor="middle" fontSize="11" className="fill-muted">{nodes[1]}</text>
        </g>
      )}

      {id === 'build' && (
        <g fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="14">
          <rect x="35" y="33" width="570" height="227" rx="12" className="fill-surface stroke-border-strong" />
          <path d="M76 33v227" className="stroke-border" />
          {[82, 122, 162, 202].map((y, index) => <text key={y} x="52" y={y} className="fill-muted/50">{index + 1}</text>)}
          <text x="94" y="82"><tspan className="fill-accent">const </tspan><tspan className="fill-foreground/80">project = </tspan><tspan className="fill-accent">await </tspan><tspan className="fill-beige">kaede.plan</tspan><tspan className="fill-muted">(brief)</tspan></text>
          <text x="94" y="122"><tspan className="fill-accent">const </tspan><tspan className="fill-foreground/80">app = </tspan><tspan className="fill-beige">build</tspan><tspan className="fill-muted">(project)</tspan></text>
          <text x="94" y="162"><tspan className="fill-accent">await </tspan><tspan className="fill-foreground/80">app.</tspan><tspan className="fill-beige">test</tspan><tspan className="fill-muted">()</tspan></text>
          <text x="94" y="202"><tspan className="fill-foreground/80">app.</tspan><tspan className="fill-beige">deploy</tspan><tspan className="fill-muted">({'{ '}</tspan><tspan className="fill-code-property">monitored</tspan><tspan className="fill-muted">: </tspan><tspan className="fill-positive">true</tspan><tspan className="fill-muted">{' }'})</tspan></text>
          {nodes.map((label, index) => <g key={label}><Check x={110 + index * 183} y={294} /><text x={128 + index * 183} y="299" fontSize="12" className="fill-muted">{label}</text></g>)}
        </g>
      )}

      {id === 'connect' && (
        <g>
          <g className="stroke-accent/50" strokeWidth="1.5" fill="none">
            <path d="M185 83h45q25 0 25 25v57h20M185 247h45q25 0 25-25v-57" />
            <path d="M455 83h-45q-25 0-25 25v57h-20M455 247h-45q-25 0-25-25v-57" />
          </g>
          <circle cx="320" cy="165" r="65" className="fill-accent/5 stroke-accent/20" />
          <circle cx="320" cy="165" r="45" className="fill-surface-2 stroke-accent/70" />
          <text x="320" y="171" textAnchor="middle" fontSize="18" className="fill-accent">Kaede</text>
          <Node x={45} y={53} width={140} label={nodes[0]} accent />
          <Node x={45} y={217} width={140} label={nodes[1]} accent />
          <Node x={455} y={53} width={140} label={nodes[2]} accent />
          <Node x={455} y={217} width={140} label={nodes[3]} accent />
          {[255, 385].map(x => <circle key={x} cx={x} cy="165" r="4" className="fill-accent" />)}
        </g>
      )}

      {id === 'launch' && (
        <g>
          <circle cx="320" cy="76" r="43" className="fill-accent/5 stroke-accent/20" />
          <circle cx="320" cy="76" r="30" className="fill-accent/10 stroke-accent/60" />
          <path d="m308 76 8 8 17-19" className="stroke-accent" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="135" y="142" width="370" height="145" rx="16" className="fill-surface-2 stroke-border-strong" />
          {nodes.map((label, index) => <g key={label}><text x="163" y={177 + index * 42} fontSize="14" className="fill-foreground/80">{label}</text><Check x={467} y={172 + index * 42} /></g>)}
          <path d="M320 119v23" className="stroke-accent/40" />
          <circle cx="320" cy="142" r="3" className="fill-accent" />
        </g>
      )}
    </svg>
  )
}
