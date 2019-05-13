import { getRowIdentity } from '../util';

const getKeysMap = function(array, rowKey) {
  const arrayMap = {};
  (array || []).forEach((row, index) => {
    arrayMap[getRowIdentity(row, rowKey)] = { row, index };
  });
  return arrayMap;
};

export default {
  states: {
    defaultExpandAll: false,
    expandRows: []
  },

  toggleRowExpansion(row, expanded) {
    let changed = false;
    const expandRows = this.states.expandRows;
    const index = expandRows.indexOf(row);
    const included = index !== -1;

    const addRow = () => {
      expandRows.push(row);
      changed = true;
    };
    const removeRow = () => {
      expandRows.splice(index, 1);
      changed = true;
    };
    if (typeof expanded === 'boolean') {
      if (expanded && !included) {
        addRow();
      } else if (!expanded && included) {
        removeRow();
      }
    } else {
      if (included) {
        removeRow();
      } else {
        addRow();
      }
    }
    if (changed) {
      this.table.$emit('expand-change', row, this.states.expandRows);
      this.scheduleLayout();
    }
  },

  setExpandRowKeys(rowKeys) {
    const { data, rowKey } = this.states;
    if (!rowKey) throw new Error('[ElTable] prop row-key is required');

    const keysMap = getKeysMap(data, rowKey);
    this.states.expandRows = rowKeys.reduce((prev, cur) => {
      const info = keysMap[cur];
      if (info) {
        prev.push(info.row);
      }
      return prev;
    }, []);
  },

  isRowExpanded(row) {
    const { expandRows = [], rowKey } = this.states;
    if (rowKey) {
      const expandMap = getKeysMap(expandRows, rowKey);
      return !!expandMap[getRowIdentity(row, rowKey)];
    }
    return expandRows.indexOf(row) !== -1;
  }
};
