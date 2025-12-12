import { computed, ref } from "vue";

export type BackupRevision = number;
export type BackupDate = string;
export interface Backup {
    revision: BackupRevision;
    date: BackupDate;
    serializeText: string;
}
const backups = ref<Backup[]>([]);

export function useBackup() {
    function loadBackups() {
        var backupsJson = localStorage.getItem("backup");
        if (backupsJson) {
            var _backups: Backup[] = JSON.parse(backupsJson);
            backups.value.splice(0, backups.value.length, ..._backups);
        }
    }
    const currentRevision = computed<number>(() => {
        if (backups.value.length > 0) {
            return Math.max(...backups.value.map(v => v.revision));
        }
        else {
            return 0;
        }
    });
    function createBackup() {
        var revision = currentRevision.value + 1;
        var date = new Date().toISOString();
        var backup = {
            revision,
            date,
            serializeText: ''
        };
        backups.value.push(backup);
        while (backups.value.length > 50) {
            backups.value.shift();
        }
        localStorage.setItem("backup", JSON.stringify(backups.value));
    }
    function restoreBackup(revision: BackupRevision) {
        var backup = backups.value.find(v => v.revision == revision);
        if (backup) {
            if (!confirm(new Date(backup.date).toLocaleString() + "時点のバックアップから復元します。よろしいですか？")) {
                return;
            }
        }
    }
    return {
        backups,
        loadBackups,
        createBackup,
        restoreBackup
    }
}