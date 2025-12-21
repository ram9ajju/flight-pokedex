// app/pokemon/[id]/loading.tsx
import styles from "./pokemon-detail.module.css";

export default function Loading() {
  return (
    <div className={styles.page}>
      <div className={styles.device}>
        <div className={styles.topBar}>
          <div className={styles.title}>National Pokédex</div>
          <div className={styles.backLink} style={{ opacity: 0.6 }}>
            ← Back
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.leftPanel}>
            <div className={styles.panel}>
              <div className={styles.spriteFrame}>
                <div style={{ width: 240, height: 240, background: "#ddd", borderRadius: 12 }} />
              </div>
              <div style={{ marginTop: 12, height: 18, width: 160, background: "#ddd" }} />
              <div style={{ marginTop: 10, height: 14, width: 220, background: "#ddd" }} />
            </div>
          </div>

          <div className={styles.rightPanel}>
            <div className={styles.panel}>
              <div className={styles.sectionTitle}>Base Stats</div>
              <div style={{ display: "grid", gap: 10 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ height: 18, background: "#ddd", borderRadius: 10 }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
