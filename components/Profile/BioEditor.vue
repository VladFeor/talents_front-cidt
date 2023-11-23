<template>
  <div class="editor-wrapper">
    <QuillEditor
      class="editor-text"
      v-model:content="data"
      contentType="html"
      @input="send"
      @paste="handlePaste"
      @blur="send"
      :toolbar="toolbarOptions"
      placeholder="Add your short bio here..."
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import '@vueup/vue-quill/dist/vue-quill.bubble.css';
import { useDebounce } from '@/hooks/useDebounce';

const content = ref('');

const toolbarOptions = [
  ['bold', 'italic', 'underline'],
  ['code-block'],
  [{ list: 'ordered' }, { list: 'bullet' }],
];

const emits = defineEmits(['update']);
const props = defineProps(['content']);

const data = ref(props.content);

const handleEditorChange = () => {
  emits('update', data.value);
};

const handlePaste = (event) => {
  event.preventDefault();
  const clipboardData = event.clipboardData || window.clipboardData;
  const pastedText = clipboardData.getData('text/plain');
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(pastedText));
  }
  useDebounce(handleEditorChange, 1000);
};

const send = useDebounce(handleEditorChange, 1000);
</script>

<style lang="scss"></style>
