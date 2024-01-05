<?php

namespace App\Http\Controllers;

use App\Models\MediaLibrary;
use DragonCode\Support\Facades\Filesystem\File;
use DragonCode\Support\Facades\Http\Url;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\UploadedFile;
use Pion\Laravel\ChunkUpload\Exceptions\UploadMissingFileException;
use Pion\Laravel\ChunkUpload\Handler\HandlerFactory;
use Pion\Laravel\ChunkUpload\Receiver\FileReceiver;
use Spatie\LaravelImageOptimizer\Facades\ImageOptimizer;
use Illuminate\Support\Str;

class MediaLibraryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if(!isset($_GET['s'])) {
            $media = MediaLibrary::with('user');
            if(isset($_GET['c'])) {
                $media->ofCollection(explode(',',$_GET['c']));
            }
            if(isset($_GET['t'])) {
                $media->ofType(explode(',',$_GET['t']));
            }
        } else {
          $media = MediaLibrary::search($_GET['s'])->query(fn($query)=>$query->with('user'));
          if(isset($_GET['c'])) {
            $media->query(fn($query)=>$query->ofCollection(explode(',',$_GET['c'])));
          }
          if(isset($_GET['t'])) {
            $media->query(fn($query)=>$query->ofType(explode(',',$_GET['t'])));
          }
        }
        $media = (isset($_GET['d']) and $_GET['d'] == 'asc') ? $media->oldest()->paginate(12) : $media->latest()->paginate(12);
        return response($media);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
      $receiver = new FileReceiver('file', $request, HandlerFactory::classFromRequest($request));
      if ($receiver->isUploaded() === false) {
          throw new UploadMissingFileException();
      }
      $save = $receiver->receive();
      if ($save->isFinished()) {
          return $this->saveFile($save->getFile(), $request);
      }
      $handler = $save->handler();

      return response()->json([
          'done' => $handler->getPercentageDone(),
      ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(MediaLibrary $mediaLibrary)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MediaLibrary $mediaLibrary)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MediaLibrary $mediaLibrary)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(mixed $mediaLibrary)
    {
          $items = MediaLibrary::whereIn('id', explode(',', $mediaLibrary));
          $medias = $items->get();
          foreach ($medias as $item) {
            $pathFile = public_path("store/$item->src");
            if (File::exists($pathFile)) {
                File::delete($pathFile);
            }
          }
          $items->delete();
          return response(['msg'=>__('actions.delete').' '.__('actions.done')], Response::HTTP_OK);
    }

    protected function saveFile(UploadedFile $file, Request $request)
    {
        $fileName = time().'_'.$file->getClientOriginalName();
        $filePath = $request->input('destination').
            '/'.
            explode('/', $file->getMimeType())[0].
            's/'.
            now()->format('Y').
            '/';
        $data = [
            'path' => $filePath.$fileName,
            'type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'title' => time().'_'.explode('.', $file->getClientOriginalName())[0],
            'user_id' => auth()->id(),
            'collection' => $request->input('collection')
        ];
        $fileItem[] = MediaLibrary::create($data)->toArray();
        $file->move(public_path("upload/$filePath"), $fileName);
        if(Str::contains($data['type'], 'image')){
          ImageOptimizer::optimize(public_path("upload/$filePath/$fileName"));
        }

        return response($fileItem, Response::HTTP_OK);
    }

    public function download(mixed $id)
    {
      return Url::temporarySignedRoute(
        'unsubscribe', now()->addMinutes(30), ['user' => auth()->id()]
      );
    }
}
