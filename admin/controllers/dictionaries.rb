Crumbles::Admin.controllers :dictionaries do
  get :index do
    @title = "Dictionaries"
    @dictionaries = Dictionary.all
    render 'dictionaries/index'
  end

  get :new do
    @title = pat(:new_title, :model => 'dictionary')
    @dictionary = Dictionary.new
    render 'dictionaries/new'
  end

  post :create do
    @dictionary = Dictionary.new(params[:dictionary])
    if @dictionary.save
      @title = pat(:create_title, :model => "dictionary #{@dictionary.id}")
      flash[:success] = pat(:create_success, :model => 'Dictionary')
      params[:save_and_continue] ? redirect(url(:dictionaries, :index)) : redirect(url(:dictionaries, :edit, :id => @dictionary.id))
    else
      @title = pat(:create_title, :model => 'dictionary')
      flash.now[:error] = pat(:create_error, :model => 'dictionary')
      render 'dictionaries/new'
    end
  end

  get :edit, :with => :id do
    @title = pat(:edit_title, :model => "dictionary #{params[:id]}")
    @dictionary = Dictionary.find(params[:id])
    if @dictionary
      render 'dictionaries/edit'
    else
      flash[:warning] = pat(:create_error, :model => 'dictionary', :id => "#{params[:id]}")
      halt 404
    end
  end

  put :update, :with => :id do
    @title = pat(:update_title, :model => "dictionary #{params[:id]}")
    @dictionary = Dictionary.find(params[:id])
    if @dictionary
      if @dictionary.update_attributes(params[:dictionary])
        flash[:success] = pat(:update_success, :model => 'Dictionary', :id =>  "#{params[:id]}")
        params[:save_and_continue] ?
          redirect(url(:dictionaries, :index)) :
          redirect(url(:dictionaries, :edit, :id => @dictionary.id))
      else
        flash.now[:error] = pat(:update_error, :model => 'dictionary')
        render 'dictionaries/edit'
      end
    else
      flash[:warning] = pat(:update_warning, :model => 'dictionary', :id => "#{params[:id]}")
      halt 404
    end
  end

  delete :destroy, :with => :id do
    @title = "Dictionaries"
    dictionary = Dictionary.find(params[:id])
    if dictionary
      if dictionary.destroy
        flash[:success] = pat(:delete_success, :model => 'Dictionary', :id => "#{params[:id]}")
      else
        flash[:error] = pat(:delete_error, :model => 'dictionary')
      end
      redirect url(:dictionaries, :index)
    else
      flash[:warning] = pat(:delete_warning, :model => 'dictionary', :id => "#{params[:id]}")
      halt 404
    end
  end

  delete :destroy_many do
    @title = "Dictionaries"
    unless params[:dictionary_ids]
      flash[:error] = pat(:destroy_many_error, :model => 'dictionary')
      redirect(url(:dictionaries, :index))
    end
    ids = params[:dictionary_ids].split(',').map(&:strip)
    dictionaries = Dictionary.find(ids)
    
    if Dictionary.destroy dictionaries
    
      flash[:success] = pat(:destroy_many_success, :model => 'Dictionaries', :ids => "#{ids.to_sentence}")
    end
    redirect url(:dictionaries, :index)
  end
end
