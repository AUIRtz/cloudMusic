{
  let view = {
    el: '.page > main',
    init() {
      this.$el = $(this.el)
    },
    template: `
      <form class="form">
        <div class="row">
          <label for="">
            歌曲名
            <input name="name" type="text" value="__name__">
          </label>
        </div>
        <div class="row">
          <label for="">
            歌手
            <input name="artist" type="text" value="__artist__">
          </label>
        </div>
        <div class="row">
          <label for="">
            外链
            <input name="url" type="text" value="__url__">
          </label>
        </div>
        <div class="row">
          <button type="submit">保存</button>
        </div>
      </form>
    `,
    render(data = {}) {
      let placeholders = ['name', 'artist', 'url', 'id']
      let html = this.template
      placeholders.map((strings) => {
        html = html.replace(`__${strings}__`, data[strings] || '')
      })
      $(this.el).html(html)
      if(data.id){ 
        $(this.el).prepend('<h1>编辑歌曲</hi>')  
      }else{
        $(this.el).prepend('<h1>新建歌曲</hi>')
      }
    },
    reset(){
      this.render({})
    }
  }
  let model = {
    data: { name: '', artist: '', url: '', id: '' },
    create(data) {
      var Song = AV.Object.extend('Song');
      var song = new Song();
      song.set('name', data.name)
      song.set('artist', data.artist)
      song.set('url', data.url)
      return song.save().then((newSong) =>{
        let {id, attributes} = newSong
        Object.assign(this.data, { id, ...attributes })
      }, function (error) {
        console.error(error);
      });
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.view.init()
      this.model = model
      this.bindEvents()
      this.view.render(this.model.data)
      window.eventHub.on('upload', (data) => {
        this.model.data = data
        this.view.render(this.model.data)
      })
      window.eventHub.on('select', (data) =>{
        this.model.data = data
        this.view.render(this.model.data)
      })
      window.eventHub.on('new', () =>{
        this.model.data = {}
        this.view.render(this.model.data)                      
      })
    },
    bindEvents() {
      this.view.$el.on('submit', 'form', (aim) => {
        aim.preventDefault()
        let needs = 'name artist url'.split(' ')
        let data = {}
        needs.map((string) => {
          data[string] = this.view.$el.find(`[name = "${string}"]`).val()
        })
        this.model.create(data)
          .then(() =>{
            this.view.reset()
            window.eventHub.trigger('create', JSON.parse(JSON.stringify(this.model.data)))
          })
      })
    }
  }

  controller.init(view, model)

}