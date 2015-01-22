Crumbles::Admin.controllers :entries do
  get :index do
    @title = "Entries"
    @entries = Entry.paginate(page: params[:page], per_page: 20)
    render 'entries/index'
  end

  get :new do
    @title = pat(:new_title, :model => 'entry')
    @entry = Entry.new
    @dictionaries = Dictionary.all
    @bulk = true
    render 'entries/new'
  end


  post :create do
    base = params[:entry]
    @dictionary_id = base[:dictionary_id]
    videos = base[:video]
    logger.info videos
    logger.info videos.count
    @success = ""
    @error = ""
    videos.each do |video|
      logger.debug "Video is #{video}"
      file = video[:tempfile]
      entry_name = video[:filename].gsub(/\.(.*)/,"")
      panda = Panda::Video.create(file: file)
      entry = Entry.new(panda_video_id: panda.id, dictionary_id: @dictionary_id, name: entry_name)
      begin
        if entry.save
          @success << "\n#{entry.name} saved"
        else
          @error << "\n#{entry.name} not saved."
        end
      rescue ActiveRecord::RecordNotUnique
        logger.info "Not Unique"
        @error << "\n#{entry.name} is a duplicate to another word already in this dictionary."
      end
      logger.debug "Errors: #{@error}"
      logger.debug "Success: #{@success}"
        
      @title = pat(:create_title, :model => 'entry')
    end
    params[:save_and_continue] ? redirect(url(:entries, :index)) : redirect(url(:entries, :new))

  end

  get :edit, :with => :id do
    @title = pat(:edit_title, :model => "entry #{params[:id]}")
    @entry = Entry.find(params[:id])
    if @entry
      render 'entries/edit'
    else
      flash[:warning] = pat(:create_error, :model => 'entry', :id => "#{params[:id]}")
      halt 404
    end
  end

  put :update, :with => :id do
    @title = pat(:update_title, :model => "entry #{params[:id]}")
    @entry = Entry.find(params[:id])
    if @entry
      if @entry.update_attributes(params[:entry])
        flash[:success] = pat(:update_success, :model => 'Entry', :id =>  "#{params[:id]}")
        params[:save_and_continue] ?
          redirect(url(:entries, :index)) :
          redirect(url(:entries, :edit, :id => @entry.id))
      else
        flash.now[:error] = pat(:update_error, :model => 'entry')
        render 'entries/edit'
      end
    else
      flash[:warning] = pat(:update_warning, :model => 'entry', :id => "#{params[:id]}")
      halt 404
    end
  end

  delete :destroy, :with => :id do
    @title = "Entries"
    entry = Entry.find(params[:id])
    if entry
      if entry.destroy
        flash[:success] = pat(:delete_success, :model => 'Entry', :id => "#{params[:id]}")
      else
        flash[:error] = pat(:delete_error, :model => 'entry')
      end
      redirect url(:entries, :index)
    else
      flash[:warning] = pat(:delete_warning, :model => 'entry', :id => "#{params[:id]}")
      halt 404
    end
  end

  delete :destroy_many do
    @title = "Entries"
    unless params[:entry_ids]
      flash[:error] = pat(:destroy_many_error, :model => 'entry')
      redirect(url(:entries, :index))
    end
    ids = params[:entry_ids].split(',').map(&:strip)
    entries = Entry.find(ids)
    
    if Entry.destroy entries
    
      flash[:success] = pat(:destroy_many_success, :model => 'Entries', :ids => "#{ids.to_sentence}")
    end
    redirect url(:entries, :index)
  end
end
