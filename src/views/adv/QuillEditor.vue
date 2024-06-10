<template>
  <div>
    <div ref="quillEditor"></div>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export default {
  name: 'QuillEditor',
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const quillEditor = ref(null);
    let quill;

    onMounted(() => {
      quill = new Quill(quillEditor.value, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['link', 'image'],
            [{ list: 'ordered' }, { list: 'bullet' }]
          ]
        }
      });

      quill.on('text-change', () => {
        emit('update:modelValue', quill.root.innerHTML);
      });

      quill.root.innerHTML = props.modelValue;
    });

    watch(() => props.modelValue, (newValue) => {
      if (quill && quill.root.innerHTML !== newValue) {
        quill.root.innerHTML = newValue;
      }
    });

    return {
      quillEditor
    };
  }
};
</script>

<style>
.ql-editor {
  min-height: 200px;
}
</style>
