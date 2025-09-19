export const Controls = () => {
  return (
    <div class="controls">
      <button id="clone">Clone</button>
      <button id="cut">Cut</button>
      <button id="remove">Remove</button>
      <select id="addBefore">
        <option value="" style={{ color: '#666', fontWeight: 'bold' }}>
          Add Before
        </option>
        <option value="common">New Common</option>
        <option value="shout">New Shout</option>
        <option value="paste" data-paste-option>
          Paste
        </option>
      </select>
      <select id="addAfter">
        <option value="" style={{ color: '#666', fontWeight: 'bold' }}>
          Add After
        </option>
        <option value="common">New Common</option>
        <option value="shout">New Shout</option>
        <option value="paste" data-paste-option>
          Paste
        </option>
      </select>
    </div>
  );
};
